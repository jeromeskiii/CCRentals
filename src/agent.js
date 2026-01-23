import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createPatch } from './patch.js';

const MAX_ITERATIONS = 10;
const AGENT_SYSTEM_PROMPT = `You are a coding assistant with file system access.

Available tools:
- read_file(path): Read a file's contents
- write_file(path, content): Write content to a file
- list_files(dir): List files in a directory
- run_command(cmd): Execute a shell command
- create_patch(path, old_content, new_content): Create a reversible patch

When given a coding task:
1. Read relevant files to understand context
2. Make necessary changes
3. Create patches for any modifications
4. Verify your changes

Respond with tool calls in this format:
\`\`\`tool
{
  "tool": "read_file",
  "path": "src/example.js"
}
\`\`\`

After using tools, provide a summary of what you did.`;

function extractToolCalls(text) {
  const toolCalls = [];
  const regex = /```tool\s*\n([\s\S]*?)\n```/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    try {
      const toolCall = JSON.parse(match[1]);
      toolCalls.push(toolCall);
    } catch (e) {
      // Skip invalid JSON
    }
  }

  return toolCalls;
}

function executeTool(toolCall, sessionId) {
  const { tool, ...params } = toolCall;

  try {
    switch (tool) {
      case 'read_file': {
        const filePath = path.resolve(params.path);
        if (!fs.existsSync(filePath)) {
          return { success: false, error: `File not found: ${params.path}` };
        }
        const content = fs.readFileSync(filePath, 'utf8');
        return { success: true, content, path: params.path };
      }

      case 'write_file': {
        const filePath = path.resolve(params.path);
        const oldContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';

        fs.writeFileSync(filePath, params.content, 'utf8');

        // Create patch if we have a session
        let patchInfo = null;
        if (sessionId && oldContent !== params.content) {
          try {
            patchInfo = createPatch({
              sessionId,
              filePath,
              oldContent,
              newContent: params.content,
              mode: 'applied',
              rationale: params.rationale || 'Agent modification',
              model: 'agent',
            });
          } catch (e) {
            // Patch creation failed, but file was written
          }
        }

        return {
          success: true,
          path: params.path,
          patch: patchInfo ? patchInfo.patchId : null,
        };
      }

      case 'list_files': {
        const dirPath = path.resolve(params.dir || '.');
        if (!fs.existsSync(dirPath)) {
          return { success: false, error: `Directory not found: ${params.dir}` };
        }
        const files = fs.readdirSync(dirPath);
        return { success: true, files, dir: params.dir || '.' };
      }

      case 'run_command': {
        const output = execSync(params.cmd, {
          encoding: 'utf8',
          cwd: process.cwd(),
          timeout: 10000,
        });
        return { success: true, output, cmd: params.cmd };
      }

      case 'create_patch': {
        if (!sessionId) {
          return { success: false, error: 'No active session for patches' };
        }
        const patchInfo = createPatch({
          sessionId,
          filePath: params.path,
          oldContent: params.old_content,
          newContent: params.new_content,
          mode: 'preview',
          rationale: params.rationale || '',
          model: 'agent',
        });
        return { success: true, ...patchInfo };
      }

      default:
        return { success: false, error: `Unknown tool: ${tool}` };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      tool,
    };
  }
}

export async function runAgent(task, session, model) {
  const messages = [
    { role: 'system', content: AGENT_SYSTEM_PROMPT },
    { role: 'user', content: task },
  ];

  const toolResults = [];
  let iteration = 0;

  while (iteration < MAX_ITERATIONS) {
    iteration++;

    // Build prompt with tool results
    let promptParts = messages.map((m) => `${m.role}: ${m.content}`);

    if (toolResults.length > 0) {
      const resultsText = toolResults
        .map((r) => `Tool: ${r.tool}\nResult: ${JSON.stringify(r.result, null, 2)}`)
        .join('\n\n');
      promptParts.push(`Tool Results:\n${resultsText}`);
    }

    const prompt = promptParts.join('\n\n');

    // Get model response
    const stream = model.complete({ prompt });
    let response = '';
    for await (const chunk of stream) {
      response += chunk;
    }

    // Extract and execute tool calls
    const toolCalls = extractToolCalls(response);

    if (toolCalls.length === 0) {
      // No more tool calls - agent is done
      return response;
    }

    // Execute all tool calls
    for (const toolCall of toolCalls) {
      const result = executeTool(toolCall, session?.sessionId);
      toolResults.push({
        tool: toolCall.tool,
        params: toolCall,
        result,
      });
    }

    // Add response to messages
    messages.push({ role: 'assistant', content: response });
  }

  return 'Agent reached maximum iterations. Task may be incomplete.';
}

export function isAgentTask(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  const agentKeywords = [
    'add',
    'create',
    'fix',
    'refactor',
    'implement',
    'change',
    'update',
    'delete',
    'remove',
    'write',
    'generate',
    'modify',
    'edit',
    'build',
  ];

  const codeKeywords = [
    'class',
    'function',
    'api',
    'test',
    'code',
    'file',
    'component',
    'module',
    'method',
  ];

  // Check for explicit agent prefix
  if (prompt.startsWith('/agent') || prompt.startsWith('agent:')) {
    return true;
  }

  // Check if it mentions files
  if (/\.(js|ts|py|go|rs|java|cpp|c|h|css|html|json|yaml|md)(\s|$)/i.test(prompt)) {
    return true;
  }

  // Check for agent keywords + code keywords
  const hasAgentKeyword = agentKeywords.some((kw) =>
    new RegExp(`\\b${kw}\\b`, 'i').test(lowerPrompt)
  );
  const hasCodeKeyword = codeKeywords.some((kw) =>
    new RegExp(`\\b${kw}\\b`, 'i').test(lowerPrompt)
  );

  return hasAgentKeyword && hasCodeKeyword;
}
