import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { checkYOLOSafety, formatSafetyWarnings, SAFETY_ERRORS } from './safety.js';

function generatePatchId(sessionId) {
  const counterPath = path.join('.blink', 'sessions', sessionId, 'patches', '.counter');
  let counter = 0;

  if (fs.existsSync(counterPath)) {
    counter = parseInt(fs.readFileSync(counterPath, 'utf8')) || 0;
  }

  counter++;
  fs.writeFileSync(counterPath, String(counter), 'utf8');

  return String(counter).padStart(4, '0');
}

function createUnifiedDiff(oldContent, newContent, filePath) {
  const timestamp = new Date().toISOString();
  const oldLines = oldContent.split('\n').filter((l) => l !== '');
  const newLines = newContent.split('\n').filter((l) => l !== '');

  const lines = [
    `--- a/${filePath}\t${timestamp}`,
    `+++ b/${filePath}\t${timestamp}`,
    `@@ -1,${oldLines.length} +1,${newLines.length} @@`,
    ...oldLines.map((l) => `-${l}`),
    ...newLines.map((l) => `+${l}`),
  ];

  return lines.join('\n') + '\n';
}

function createPatchMetadata({
  patchId,
  sessionId,
  filePath,
  mode,
  rationale,
  model,
  filesChanged,
}) {
  return {
    patch_id: patchId,
    timestamp: new Date().toISOString(),
    session_id: sessionId,
    mode,
    files_changed: filesChanged || [filePath],
    rationale: rationale || '',
    model: model || 'unknown',
    undo_command: `git apply -R .blink/sessions/${sessionId}/patches/${patchId}_${path.basename(filePath)}.patch`,
    revertable: true,
  };
}

function validatePath(filePath) {
  const resolved = path.resolve(filePath);
  const cwd = process.cwd();

  if (!resolved.startsWith(cwd) && !resolved.startsWith(path.join('.blink', 'sessions'))) {
    throw new Error(`Security violation: Path outside allowed directory: ${filePath}`);
  }

  const relative = path.relative(cwd, resolved);
  if (relative.startsWith('..')) {
    throw new Error(`Security violation: Path traversal attempt: ${filePath}`);
  }

  return resolved;
}

export function createPatch({
  sessionId,
  filePath,
  oldContent,
  newContent,
  mode = 'preview',
  rationale = '',
  model = '',
}) {
  if (!oldContent || !newContent) {
    throw new Error('Both oldContent and newContent are required');
  }

  if (oldContent === newContent) {
    throw new Error('No changes detected - old and new content are identical');
  }

  const validatedPath = validatePath(filePath);

  const patchId = generatePatchId(sessionId);
  const patchesDir = path.join('.blink', 'sessions', sessionId, 'patches');
  const relativePath = path.relative(process.cwd(), validatedPath) || path.basename(validatedPath);
  const patchFileName = `${patchId}_${path.basename(relativePath).replace(/\//g, '_')}.patch`;
  const metaFileName = `${patchId}_meta.json`;
  const patchPath = path.join(patchesDir, patchFileName);
  const metaPath = path.join(patchesDir, metaFileName);

  const diff = createUnifiedDiff(oldContent, newContent, relativePath);
  const metadata = createPatchMetadata({
    patchId,
    sessionId,
    filePath: relativePath,
    mode,
    rationale,
    model,
    filesChanged: [relativePath],
  });

  fs.writeFileSync(patchPath, diff, 'utf8');
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf8');

  return {
    patchId,
    patchPath,
    metaPath,
    metadata,
    diff,
    preview: diff,
  };
}

export function applyPatch(patchPath, options = {}) {
  const yolo = options.yolo || false;
  const validatedPath = validatePath(patchPath);

  if (yolo) {
    const yoloCheck = checkYOLOSafety(process.cwd());
    if (!yoloCheck.allowed) {
      const warnings = formatSafetyWarnings({ errors: yoloCheck.errors });
      throw new Error(`YOLO mode safety violation:\n${warnings}`);
    }
  } else {
    const safety = checkYOLOSafety(process.cwd());
    if (!safety.allowed) {
      const warnings = formatSafetyWarnings({ errors: safety.errors });
      throw new Error(
        `Safety check failed:\n${warnings}\n\nUse --yolo flag to bypass (not recommended)`
      );
    }
  }

  if (!fs.existsSync(validatedPath)) {
    throw new Error(`Patch file not found: ${validatedPath}`);
  }

  try {
    execSync(`git apply --check "${validatedPath}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (error) {
    throw new Error(`Patch check failed: ${error.message}`);
  }

  execSync(`git apply "${validatedPath}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  return { success: true, applied: true, mode: yolo ? 'yolo' : 'applied' };
}

export function undoPatch(patchPath) {
  const validatedPath = validatePath(patchPath);

  if (!fs.existsSync(validatedPath)) {
    throw new Error(`Patch file not found: ${validatedPath}`);
  }

  try {
    execSync(`git apply --check --reverse "${validatedPath}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (error) {
    throw new Error(`Patch undo check failed: ${error.message}`);
  }

  execSync(`git apply --reverse "${validatedPath}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  return { success: true, undone: true };
}

export function listPatches(sessionId) {
  const patchesDir = path.join('.blink', 'sessions', sessionId, 'patches');

  if (!fs.existsSync(patchesDir)) {
    return [];
  }

  const files = fs.readdirSync(patchesDir);
  const patches = [];

  for (const file of files) {
    if (file.endsWith('_meta.json')) {
      const patchId = file.replace('_meta.json', '');
      const metaPath = path.join(patchesDir, file);

      const patchFiles = files.filter((f) => f.startsWith(patchId) && f.endsWith('.patch'));
      if (patchFiles.length > 0) {
        const patchPath = path.join(patchesDir, patchFiles[0]);

        if (fs.existsSync(metaPath) && fs.existsSync(patchPath)) {
          const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          patches.push({
            patchId,
            patchPath,
            metaPath,
            metadata,
          });
        }
      }
    }
  }

  return patches.sort((a, b) => parseInt(a.patchId) - parseInt(b.patchId));
}
