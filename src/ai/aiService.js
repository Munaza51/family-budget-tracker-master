export async function getBudgetTips(summary) {
  
  const key = "sk-or-v1-";

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://delightful-baklava-f727aa.netlify.app/", 
      "X-Title": "Family Budget Tracker",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI financial advisor who gives short, practical budget-saving tips based on user's expenses.",
        },
        {
          role: "user",
          content: `Here is a summary of my spending: ${summary}. Please give 2–3 short, simple tips on how to save money.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("OpenRouter error: " + err);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "No tips generated.";
}
