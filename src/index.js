import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const LANGUAGE_MAP = {
  '.js': 'javascript',
  '.ts': 'typescript',
  '.jsx': 'javascript',
  '.tsx': 'typescript',
  '.py': 'python',
  '.go': 'go',
  '.rs': 'rust',
  '.cpp': 'cpp',
  '.c': 'c',
  '.java': 'java',
};

export function detectLanguage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return LANGUAGE_MAP[ext] || 'unknown';
}

function isGitRepo(dir) {
  const gitDir = path.join(dir, '.git');
  return fs.existsSync(gitDir);
}

function getGitFiles(dir) {
  try {
    const files = execSync('git ls-files', {
      cwd: dir,
      encoding: 'utf8',
    });
    return files.split('\n').filter((f) => f.length > 0);
  } catch (error) {
    return [];
  }
}

function getFileStats(filePath, baseDir) {
  const fullPath = path.join(baseDir, filePath);
  try {
    const stats = fs.statSync(fullPath);
    return {
      size: stats.size,
      mtime: stats.mtime.toISOString(),
    };
  } catch (error) {
    return {
      size: 0,
      mtime: null,
    };
  }
}

function generateRepoManifest(dir) {
  const manifest = {
    schema_version: '1.0',
    generated_at: new Date().toISOString(),
    root_dir: dir,
    is_git_repo: false,
    files: [],
    summary: {
      total_files: 0,
      total_size: 0,
      languages: {},
      directories: {},
    },
  };

  if (isGitRepo(dir)) {
    manifest.is_git_repo = true;

    const gitFiles = getGitFiles(dir);

    for (const file of gitFiles) {
      const stats = getFileStats(file, dir);
      const language = detectLanguage(file);
      const dirname = path.dirname(file) || '.';

      const fileEntry = {
        path: file,
        language,
        size: stats.size,
        mtime: stats.mtime,
      };

      manifest.files.push(fileEntry);
      manifest.summary.total_files++;
      manifest.summary.total_size += stats.size;

      manifest.summary.languages[language] = (manifest.summary.languages[language] || 0) + 1;
      manifest.summary.directories[dirname] = (manifest.summary.directories[dirname] || 0) + 1;
    }
  }

  return manifest;
}

export function attachRepoToSession(sessionDir, workingDir) {
  const manifestPath = path.join(sessionDir, 'repo_manifest.json');

  const manifest = generateRepoManifest(workingDir);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  return {
    attached: manifest.is_git_repo,
    manifest,
    manifestPath,
  };
}

export { isGitRepo, generateRepoManifest };
