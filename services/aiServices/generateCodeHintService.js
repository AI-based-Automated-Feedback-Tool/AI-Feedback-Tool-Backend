// services/aiServices/generateCodeHintService.js

const cohere = require("./cohereService");

/**
 * Returns: { hintText, cooldownSeconds, remainingHints? }
 */
async function generateCodeHint({
  examId,
  questionId,
  promptText,
  language,
  starterCode = "",
  studentCode = "",
  testCases = [],
  hintTier = "Nudge",
}) {
  const tierGuidance = {
    Nudge:
      "Give a gentle conceptual nudge. Do NOT write code. Keep it brief (2–3 sentences).",
    Scaffold:
      "Give a bit more structure (2–3 steps). If absolutely needed, include at most one tiny code snippet (<=5 lines).",
    Targeted:
      "Point to the most likely mistake area and suggest a specific next change. At most one tiny code snippet (<=5 lines).",
  };

  const payload = `
You are a helpful coding tutor. Provide an incremental hint (NOT a full solution).

Language: ${language}

Problem:
${promptText}

Starter code:
${fence(starterCode, language)}

Student code:
${fence(studentCode, language)}

Unit tests (optional):
${fence(formatTests(testCases), language)}

Hint Tier: ${hintTier}
Tier Guidance: ${tierGuidance[hintTier] || tierGuidance.Nudge}

Rules:
- Do NOT provide the full solution.
- Prefer pointing out likely mistake locations or concepts over writing code.
- If you include code, keep it <= 5 lines and only if essential.
- Output format:
  Hint: <2–4 concise sentences>
  Next step: <one concrete action>
`.trim();

  try {
    const aiText = await cohere.generate(payload);
    return {
      hintText: aiText,
      cooldownSeconds: 15,
      remainingHints: null,
    };
  } catch (err) {
    console.error("Code AI Hint Error:", err);
    return {
      hintText:
        "Trace the data through your function and log intermediate values near the suspected lines. Compare expected vs actual for one failing test.",
      cooldownSeconds: 15,
      remainingHints: null,
    };
  }
}

function fence(code, lang) {
  if (!code) return "(none)";
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

function formatTests(tests) {
  if (!Array.isArray(tests) || tests.length === 0) return "(none)";
  return tests
    .map((t) => (typeof t === "string" ? t : JSON.stringify(t, null, 2)))
    .join("\n\n");
}

module.exports = { generateCodeHint };
