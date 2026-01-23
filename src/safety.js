import { execSync } from 'node:child_process';
import path from 'node:path';

const SAFETY_ERRORS = {
  NOT_GIT_REPO: 'NOT_GIT_REPO',
  DIRTY_WORKING_TREE: 'DIRTY_WORKING_TREE',
  OUTSIDE_WORKSPACE: 'OUTSIDE_WORKSPACE',
  YOLO_BLOCKED: 'YOLO_BLOCKED',
};

function isGitRepo(dir) {
  try {
    execSync(`git rev-parse --git-dir 2>&1`, {
      cwd: dir,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return true;
  } catch (error) {
    return false;
  }
}

function isWorkingTreeClean(dir) {
  try {
    const result = execSync(`git status --porcelain`, {
      cwd: dir,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return result.trim() === '';
  } catch (error) {
    return false;
  }
}

export function checkYOLOSafety(dir) {
  if (!isGitRepo(dir)) {
    return {
      allowed: false,
      reason: SAFETY_ERRORS.NOT_GIT_REPO,
      errors: [
        {
          code: SAFETY_ERRORS.NOT_GIT_REPO,
          message: 'Not in a git repository',
          suggestion: 'Initialize git repo',
        },
      ],
    };
  }

  if (!isWorkingTreeClean(dir)) {
    return {
      allowed: false,
      reason: SAFETY_ERRORS.DIRTY_WORKING_TREE,
      errors: [
        {
          code: SAFETY_ERRORS.DIRTY_WORKING_TREE,
          message: 'Working tree is not clean',
          suggestion: 'Commit changes first',
        },
      ],
    };
  }

  return { allowed: true };
}

export function formatSafetyWarnings(safetyResult) {
  const lines = [];

  if (safetyResult.errors && safetyResult.errors.length > 0) {
    lines.push('\n❌ Safety Violations:');
    safetyResult.errors.forEach((e) => {
      lines.push(`  - ${e.message}`);
      if (e.suggestion) {
        lines.push(`    Suggestion: ${e.suggestion}`);
      }
    });
  }

  return lines.join('\n');
}

export { SAFETY_ERRORS, isGitRepo, isWorkingTreeClean };
