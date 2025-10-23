// Simple OpenAI fetch wrapper for demo use ONLY.
// WARNING: Do NOT embed your secret key in public repos.
// For production, call OpenAI from a secure backend.

export async function getBudgetTips(summary) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) throw new Error("OpenAI API key missing (VITE_OPENAI_API_KEY).");

  const prompt = `You are a friendly, practical budgeting assistant.
Summarize this spending breakdown and suggest 3 practical, polite, and culturally sensitive ways to save money for a family in a low-bandwidth context.
Spending: ${summary}
Output as short bullet points.`;

  const body = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "No tips returned.";
}
