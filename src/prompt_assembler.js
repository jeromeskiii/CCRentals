import fs from "node:fs";

function estimateTokens(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/g).length;
}

export async function buildPromptFromSession(session, currentPrompt, maxTotalTokens = 4000) {
  const segments = [];

  // Add seed if available
  if (session.seed && session.seed.user_goal) {
    const seedText = `User Goal: ${session.seed.user_goal}`;
    segments.push({
      key: "seed",
      text: seedText,
      tokens: estimateTokens(seedText)
    });
  }

  // Add repo manifest if attached
  if (session.repoManifest) {
    const repoText = `Repo: ${session.repoManifest.summary.total_files} files, ${Object.keys(session.repoManifest.summary.languages).join(", ")}`;
    segments.push({
      key: "repo_manifest",
      text: repoText,
      tokens: estimateTokens(repoText)
    });
  }

  // Add current prompt
  if (currentPrompt) {
    segments.push({
      key: "current_request",
      text: `Current Request:\n${currentPrompt}`,
      tokens: estimateTokens(currentPrompt)
    });
  }

  const totalTokens = segments.reduce((sum, s) => sum + s.tokens, 0);
  const prompt = segments.map(s => s.text).join("\n\n---\n\n");

  return {
    prompt,
    segments,
    totalTokens,
    deterministic: true
  };
}

export function logPrompt(promptResult, logPath) {
  if (!logPath || !promptResult) return;

  const logEntry = {
    timestamp: new Date().toISOString(),
    segments: promptResult.segments.map(s => ({
      key: s.key,
      tokens: s.tokens
    })),
    totalTokens: promptResult.totalTokens
  };

  fs.appendFileSync(logPath, JSON.stringify(logEntry) + "\n", "utf8");
}
