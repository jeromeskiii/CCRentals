import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { attachRepoToSession } from './index.js';
import { createLSPManager } from './lsp.js';

const BLINK_DIR = '.blink';
const SESSIONS_DIR = path.join(BLINK_DIR, 'sessions');

function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `${timestamp}-${random}`;
}

function ensureBlinkStructure(sessionId) {
  const sessionPath = path.join(SESSIONS_DIR, sessionId);

  const dirs = [
    BLINK_DIR,
    SESSIONS_DIR,
    sessionPath,
    path.join(sessionPath, 'index'),
    path.join(sessionPath, 'patches'),
    path.join(sessionPath, 'logs'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const counterPath = path.join(sessionPath, 'patches', '.counter');
  if (!fs.existsSync(counterPath)) {
    fs.writeFileSync(counterPath, '0', 'utf8');
  }

  return {
    sessionPath,
    transcriptPath: path.join(sessionPath, 'transcript.ndjson'),
    seedPath: path.join(sessionPath, 'seed.json'),
    metaPath: path.join(sessionPath, 'meta.json'),
    repoManifestPath: path.join(sessionPath, 'repo_manifest.json'),
    promptLogPath: path.join(sessionPath, 'logs', 'prompts.ndjson'),
    patchesDir: path.join(sessionPath, 'patches'),
    counterPath,
  };
}

function createMeta(modelId) {
  return {
    schema_version: '1.0',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    model_id: modelId,
    blink_version: '0.1.0',
  };
}

function generateSeed({ initialPrompt, modelId }) {
  const sessionDate = new Date();
  const dateStr = sessionDate.toISOString().slice(0, 10);
  const timeStr = sessionDate.toTimeString().slice(0, 8).replace(/:/g, '-');

  return {
    session_id: `${dateStr}T${timeStr}-blink`,
    origin: 'stateless',
    user_goal: initialPrompt || '',
    decisions_locked: [
      'Blink is stateless by default',
      'Ctrl-S escalates into a file-backed session',
      'Indexing must be tiered and fast-first',
      'All edits are patch-first with receipts',
    ],
    open_questions: [],
    prompt_policy: {
      pin: ['decisions_locked', 'repo_manifest'],
      tail_turns: 6,
      never_auto_include: ['full_transcript'],
    },
  };
}

function writeJson(filePath, data) {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write JSON to ${filePath}: ${error.message}`);
  }
}

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }
    throw new Error(`Failed to read JSON from ${filePath}: ${error.message}`);
  }
}

function appendTranscript(transcriptPath, role, content) {
  const turn = {
    timestamp: new Date().toISOString(),
    role,
    content,
  };
  const line = JSON.stringify(turn);
  fs.appendFileSync(transcriptPath, line + '\n', 'utf8');
}

export function createSession({ seed, initialPrompt, modelId, enableLSP = false, lspCaps = {} }) {
  const sessionId = generateSessionId();
  const paths = ensureBlinkStructure(sessionId);

  const meta = createMeta(modelId);
  meta.index_tier = enableLSP ? 2 : 1;
  meta.lsp_enabled = enableLSP;
  writeJson(paths.metaPath, meta);

  const seedData = seed || generateSeed({ initialPrompt, modelId });
  writeJson(paths.seedPath, seedData);

  let repoAttached = false;
  let repoFileCount = 0;
  let repoManifest = null;
  try {
    const repoResult = attachRepoToSession(paths.sessionPath, process.cwd());
    repoAttached = repoResult.attached;
    repoManifest = repoResult.manifest;
    repoFileCount = repoManifest.summary.total_files;
  } catch (error) {
    // Silently fail if repo attachment fails
  }

  let lspManager = null;
  let lspCapabilities = null;
  if (enableLSP) {
    lspManager = createLSPManager({
      enabled: true,
      sessionDir: paths.sessionPath,
      caps: lspCaps,
    });
    lspCapabilities = lspManager.getCapabilities();
  }

  return {
    sessionId,
    paths,
    meta,
    seed: seedData,
    repoAttached,
    repoFileCount,
    repoManifest,
    indexTier: enableLSP ? 2 : 1,
    lspManager,
    lspCapabilities,
  };
}

export function setActiveSession(session) {
  return session;
}

export function getActiveSession() {
  return null;
}

export function addTranscriptTurn({ transcriptPath, role, content }) {
  appendTranscript(transcriptPath, role, content);

  const metaPath = path.join(path.dirname(transcriptPath), 'meta.json');
  if (fs.existsSync(metaPath)) {
    try {
      const meta = readJson(metaPath);
      meta.updated_at = new Date().toISOString();
      writeJson(metaPath, meta);
    } catch (error) {
      console.warn(`Warning: Failed to update session metadata: ${error.message}`);
    }
  }
}

export function loadSession(sessionId) {
  const sessionPath = path.join(SESSIONS_DIR, sessionId);
  const metaPath = path.join(sessionPath, 'meta.json');

  if (!fs.existsSync(metaPath)) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const meta = readJson(metaPath);

  const paths = {
    sessionPath,
    transcriptPath: path.join(sessionPath, 'transcript.ndjson'),
    seedPath: path.join(sessionPath, 'seed.json'),
    metaPath,
    repoManifestPath: path.join(sessionPath, 'repo_manifest.json'),
  };

  return {
    sessionId,
    paths,
    meta,
  };
}

export function listSessions() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    return [];
  }

  const sessionIds = fs.readdirSync(SESSIONS_DIR);
  const sessions = [];

  for (const id of sessionIds) {
    const metaPath = path.join(SESSIONS_DIR, id, 'meta.json');
    if (fs.existsSync(metaPath)) {
      try {
        const meta = readJson(metaPath);
        sessions.push({ sessionId: id, meta });
      } catch (error) {
        console.warn(`Warning: Failed to load session ${id}: ${error.message}`);
      }
    }
  }

  return sessions;
}
