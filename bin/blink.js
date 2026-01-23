#!/usr/bin/env node

import { createModelFromEnv } from '../src/model.js';
import { createSession, addTranscriptTurn } from '../src/session.js';
import { buildPromptFromSession, logPrompt } from '../src/prompt_assembler.js';
import { runAgent, isAgentTask } from '../src/agent.js';
import {
  showNotification,
  showSaveProgress,
  showSaveComplete,
  renderSessionInfo,
  renderFileTree,
  renderTranscript,
  STATUS_ICONS,
} from '../src/tui.js';

let activeSession = null;

function printSessionStatus() {
  if (activeSession) {
    const tier = activeSession.indexTier || 1;
    const tierLabel = tier === 2 ? 'Tier 2 (LSP)' : 'Tier 1';
    const status = activeSession.repoAttached ? 'Session: ON (repo)' : 'Session: ON';
    process.stderr.write(
      `\r${STATUS_ICONS.session} ${status} [${activeSession.sessionId}] ${STATUS_ICONS.lsp} ${tierLabel}\n`
    );
  }
}

async function handleStatelessMode(prompt, model) {
  const stream = model.complete({ prompt });

  let response = '';
  for await (const chunk of stream) {
    process.stdout.write(chunk);
    response += chunk;
  }
  process.stdout.write('\n');

  return response;
}

async function handleSessionMode(prompt, model, session) {
  activeSession = session;
  printSessionStatus();

  addTranscriptTurn({
    transcriptPath: session.paths.transcriptPath,
    role: 'user',
    content: prompt,
  });

  const promptResult = await buildPromptFromSession(session, prompt);
  const finalPrompt = promptResult.prompt;

  if (session.paths?.promptLogPath) {
    logPrompt(promptResult, session.paths.promptLogPath);
  }

  if (process.env.BLINK_DEBUG_PROMPT === '1') {
    showNotification(`Prompt tokens: ${promptResult.totalTokens}`, 'info');
    const segments = promptResult.segments.map((s) => s.key).join(', ');
    showNotification(`Segments: ${segments}`, 'info');
  }

  const stream = model.complete({ prompt: finalPrompt });

  let response = '';
  for await (const chunk of stream) {
    process.stdout.write(chunk);
    response += chunk;
  }
  process.stdout.write('\n');

  addTranscriptTurn({
    transcriptPath: session.paths.transcriptPath,
    role: 'assistant',
    content: response,
  });

  return response;
}

async function handleAgentMode(task, model, session) {
  showNotification('Agent mode activated', 'info');
  process.stderr.write('🤖 Agent working...\n');

  try {
    const result = await runAgent(task, session, model);
    process.stdout.write('\n' + result + '\n');
    return result;
  } catch (error) {
    showNotification(`Agent failed: ${error.message}`, 'error');
    throw error;
  }
}

async function interactiveMode(model) {
  process.stderr.write(
    'Blink agent-ready (Ctrl+C exit • Ctrl+S save session • /agent force agent)\n'
  );
  printSessionStatus();

  let firstPrompt = null;
  let tier2Enabled = process.env.BLINK_TIER2 === '1';

  async function readLineWithCtrlS() {
    const readline = await import('node:readline');

    return new Promise((resolve) => {
      let inputBuffer = '';
      let resolved = false;

      const stdin = process.stdin;

      // Check if stdin is a TTY before using raw mode
      const isTTY = stdin.isTTY;

      if (isTTY) {
        readline.emitKeypressEvents(stdin);
        stdin.setRawMode(true);
      }

      const keypressHandler = (str, key) => {
        if (resolved) return;

        if (key.ctrl && key.name === 's') {
          if (!activeSession) {
            showSaveProgress('...');

            const session = createSession({
              seed: null,
              initialPrompt: firstPrompt,
              modelId: model.id,
              enableLSP: tier2Enabled,
              lspCaps: tier2Enabled ? { memoryMB: 512, timeSeconds: 30 } : {},
            });

            activeSession = session;
            showSaveComplete(session);
            printSessionStatus();
            process.stderr.write('> ');
          }
          return;
        }

        if (key.ctrl && key.name === 'c') {
          if (isTTY) stdin.setRawMode(false);
          stdin.removeListener('keypress', keypressHandler);
          resolved = true;
          process.exit(0);
          return;
        }

        if (key.name === 'return') {
          if (isTTY) stdin.setRawMode(false);
          stdin.removeListener('keypress', keypressHandler);
          resolved = true;
          process.stdout.write('\n');
          resolve(inputBuffer);
          return;
        }

        if (key.name === 'backspace') {
          if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            process.stdout.write('\b \b');
          }
          return;
        }

        if (str && str.length === 1) {
          inputBuffer += str;
          process.stdout.write(str);
        }
      };

      if (isTTY) {
        stdin.on('keypress', keypressHandler);
      } else {
        // Fallback for non-TTY (piped input)
        const rl = readline.createInterface({
          input: stdin,
          output: process.stdout,
        });

        rl.on('line', (line) => {
          resolved = true;
          resolve(line);
          rl.close();
        });
      }

      process.stdout.write('> ');
    });
  }

  while (true) {
    const prompt = await readLineWithCtrlS();

    if (prompt.trim() === '') continue;

    if (prompt.trim() === 'tier2') {
      if (!activeSession) {
        tier2Enabled = !tier2Enabled;
        showNotification(`Tier 2: ${tier2Enabled ? 'enabled' : 'disabled'}`, 'info');
      } else {
        showNotification('Cannot toggle Tier 2 while session is active', 'warning');
      }
      continue;
    }

    if (prompt.trim() === 'status' && activeSession) {
      process.stderr.write('\n');
      process.stderr.write(renderSessionInfo(activeSession));
      continue;
    }

    if (prompt.trim() === 'tree' && activeSession && activeSession.repoAttached) {
      process.stderr.write('\n');
      const files = activeSession.repoManifest.files.slice(0, 20);
      process.stderr.write(renderFileTree(files, { showIcons: true, showColors: true }));
      process.stderr.write('\n');
      continue;
    }

    if (prompt.trim() === 'history' && activeSession) {
      process.stderr.write('\n');
      const fs = (await import('node:fs')).default;

      if (fs.existsSync(activeSession.paths.transcriptPath)) {
        const content = fs.readFileSync(activeSession.paths.transcriptPath, 'utf8');
        const lines = content.split('\n').filter((l) => l.trim());
        const turns = lines.map((l) => JSON.parse(l));
        process.stderr.write(renderTranscript(turns, { maxTurns: 5, showTimestamps: true }));
      } else {
        process.stderr.write('No transcript history yet\n');
      }
      process.stderr.write('\n');
      continue;
    }

    if (!firstPrompt) {
      firstPrompt = prompt;
    }

    // Auto-detect agent tasks or explicit /agent prefix
    let task = prompt;
    if (task.startsWith('/agent ')) {
      task = task.slice(7);
    }

    const shouldUseAgent = isAgentTask(task);

    if (shouldUseAgent) {
      await handleAgentMode(task, model, activeSession);
    } else if (activeSession) {
      await handleSessionMode(prompt, model, activeSession);
    } else {
      await handleStatelessMode(prompt, model);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const model = createModelFromEnv();

  if (args.length === 0 || args[0] === '-i' || args[0] === '--interactive') {
    await interactiveMode(model);
    return;
  }

  const prompt = args.join(' ');

  try {
    const shouldUseAgent = isAgentTask(prompt);

    if (shouldUseAgent) {
      await handleAgentMode(prompt, model, activeSession);
    } else if (activeSession) {
      await handleSessionMode(prompt, model, activeSession);
    } else {
      await handleStatelessMode(prompt, model);
    }
  } catch (error) {
    const message = error && typeof error.message === 'string' ? error.message : String(error);
    process.stderr.write(message + '\n');
    process.exitCode = 1;
  }
}

main();
