const LSP_LANGUAGE_SERVERS = {
  javascript: { name: "typescript-language-server", command: "typescript-language-server" },
  typescript: { name: "typescript-language-server", command: "typescript-language-server" },
  python: { name: "pylsp", command: "pylsp" },
  go: { name: "gopls", command: "gopls" },
  rust: { name: "rust-analyzer", command: "rust-analyzer" },
  cpp: { name: "clangd", command: "clangd" },
  c: { name: "clangd", command: "clangd" }
};

class LSPManager {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.caps = options.caps || { memoryMB: 512, timeSeconds: 30 };
  }

  getCapabilities() {
    return {
      enabled: this.enabled,
      availableLanguages: Object.keys(LSP_LANGUAGE_SERVERS),
      serverCount: Object.keys(LSP_LANGUAGE_SERVERS).length,
      caps: this.caps,
      fallbackAvailable: true
    };
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}

export function createLSPManager(options) {
  return new LSPManager(options);
}

export { LSPManager, LSP_LANGUAGE_SERVERS };
