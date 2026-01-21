# Blink CLI - Agent-Ready AI Assistant

**Blink is now agent-ready** with automatic file operations, patch creation, and intelligent tool use.

## Quick Start

```bash
# Install
cd blink
chmod +x bin/blink.js

# Test (fake echo mode)
node bin/blink.js

# With a real LLM
export BLINK_PROVIDER=anthropic
export ANTHROPIC_API_KEY=your-key-here
node bin/blink.js
```

## Agent Mode

Blink automatically detects coding tasks and switches to agent mode:

```bash
> add a User class to User.js
🤖 Agent working...
✓ Created User.js
✓ Patch saved: 0001_User.js.patch

> refactor the login function
🤖 Agent working...
✓ Modified auth.js
✓ Patch saved: 0002_auth.js.patch
```

### Agent Triggers

Agent mode activates when you use:
- Action verbs: `add`, `create`, `fix`, `refactor`, `implement`, `change`, `update`, `delete`, `write`, `generate`
- Code references: `.js`, `.ts`, `.py`, `function`, `class`, `api`, `test`
- Explicit prefix: `/agent add a function`

### Available Tools

The agent can:
- **read_file(path)** - Read file contents
- **write_file(path, content)** - Write/modify files
- **list_files(dir)** - List directory contents
- **run_command(cmd)** - Execute shell commands
- **create_patch()** - Create reversible patches

## Session Mode

Press `Ctrl+S` to create a persistent session with context:

```bash
> analyze this codebase
# Press Ctrl+S
✓ Session saved: mkg6fc8e-fda9a53b
✓ Repo attached: 15 files

> now refactor the API
# Context from previous turns
```

## Supported Providers

### Anthropic (Claude)
```bash
export BLINK_PROVIDER=anthropic
export ANTHROPIC_API_KEY=sk-ant-...
export BLINK_MODEL=claude-3-5-sonnet-20241022
```

### OpenAI
```bash
export BLINK_PROVIDER=openai
export OPENAI_API_KEY=sk-...
export BLINK_MODEL=gpt-4o
```

### MiniMax
```bash
export BLINK_PROVIDER=minimax
export MINIMAX_API_KEY=sk-cp-...
export BLINK_MODEL=MiniMax-M2.1
```

### Fake (Testing)
```bash
export BLINK_PROVIDER=fake
# No API key needed
```

## Commands

- `status` - Show session info
- `tree` - Show file tree
- `history` - Show conversation history
- `tier2` - Toggle LSP mode (before session)
- `/agent <task>` - Force agent mode

## Architecture

```
.blink/
└── sessions/<id>/
    ├── seed.json              # Initial prompt
    ├── transcript.ndjson      # Conversation history
    ├── repo_manifest.json     # File index
    ├── patches/
    │   ├── 0001_file.patch   # Reversible edits
    │   └── 0001_meta.json    # Patch metadata
    └── logs/
        └── prompts.ndjson    # Prompt construction logs
```

## Safety

- All file modifications create reversible patches
- Git integration for safe operations
- Clear error messages with suggestions

## License

MIT
