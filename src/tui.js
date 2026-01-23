const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function colorize(text, color) {
  return `${color}${text}${COLORS.reset}`;
}

export const STATUS_ICONS = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  session: '●',
  repo: '📦',
  lsp: '🔍',
};

export function showNotification(message, type = 'info') {
  const icon = STATUS_ICONS[type] || STATUS_ICONS.info;
  const color = type === 'error' ? COLORS.red : type === 'success' ? COLORS.green : COLORS.yellow;
  process.stderr.write(`\r${colorize(`${icon} ${message}`, color)}\n`);
}

export function showSaveProgress(sessionId) {
  process.stderr.write(
    `\r${colorize('⏺', COLORS.green)} Saving as session: ${colorize(sessionId, COLORS.cyan)}...`
  );
}

export function showSaveComplete(session) {
  process.stderr.write(
    `\r${colorize('✓', COLORS.green)} Session saved: ${colorize(session.sessionId, COLORS.cyan)}\n`
  );

  if (session.repoAttached) {
    process.stderr.write(
      `  ${colorize('✓', COLORS.green)} Repo attached: ${colorize(session.repoFileCount, COLORS.yellow)} files\n`
    );
  }

  if (session.indexTier === 2 && session.lspCapabilities) {
    const langs = session.lspCapabilities.availableLanguages.join(', ');
    process.stderr.write(
      `  ${colorize('✓', COLORS.green)} Tier 2 enabled: ${colorize(langs, COLORS.yellow)}\n`
    );
  }
}

export function renderSessionInfo(session) {
  const lines = [
    '╔══════════════════════════════════════╗',
    '║          Blink Session Info          ║',
    '╠══════════════════════════════════════╣',
    `║ ID:    ${session.sessionId.padEnd(28)}║`,
    `║ Tier:  ${session.indexTier || 1}                              ║`,
    `║ Files: ${session.repoFileCount || 0} files                       ║`,
    `║ Repo:  ${session.repoAttached ? '✓ attached' : '✗ none'}                    ║`,
    '╚══════════════════════════════════════╝',
  ];
  return lines.join('\n');
}

export function renderFileTree(files, options = {}) {
  return files.map((f) => `  📄 ${f.path}`).join('\n');
}

export function renderTranscript(turns, options = {}) {
  const maxTurns = options.maxTurns || 10;
  const recentTurns = turns.slice(-maxTurns);
  return recentTurns
    .map((t) => {
      const role = t.role.charAt(0).toUpperCase() + t.role.slice(1);
      const content = t.content.substring(0, 100) + (t.content.length > 100 ? '...' : '');
      return `${colorize(role, COLORS.yellow)}: ${content}`;
    })
    .join('\n');
}
