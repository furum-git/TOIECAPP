export const MODEL = "gpt-4.1-nano";
export const VISION_MODEL = "gpt-4.1-nano";
export const MAX_TOKENS = 8192;

const TOEIC_SEARCH_QUERIES = [
  "office workers meeting bright daylight",
  "business people working indoors",
  "person typing laptop desk",
  "people shopping supermarket",
  "construction worker building site",
  "chef cooking kitchen",
  "airport check-in counter",
  "person reading library daytime",
  "doctor patient hospital room",
  "people walking park sunny",
  "warehouse worker shelves",
  "mechanic repairing car",
  "presenter conference room",
  "cashier customer store",
  "delivery person package",
];

export function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = match ? match[1].trim() : text.trim();
  // JSON文字列値内のリテラル改行をエスケープして修正
  return raw.replace(/("(?:[^"\\]|\\.)*")/g, (m) =>
    m.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
  );
}

export async function fetchPexelsPhoto(): Promise<{ url: string; alt: string }> {
  const query = TOEIC_SEARCH_QUERIES[Math.floor(Math.random() * TOEIC_SEARCH_QUERIES.length)];
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape&size=medium`,
    { headers: { Authorization: process.env.PEXELS_API_KEY ?? "" }, signal: AbortSignal.timeout(60000) }
  );
  if (!res.ok) throw new Error("Pexels API error");
  const data = await res.json();
  const photos = data.photos as { src: { large: string }; alt: string }[];
  // 先頭5枚（Pexelsの関連度が高い順）からランダム選択して暗い写真を減らす
  const candidates = photos.slice(0, Math.min(5, photos.length));
  const photo = candidates[Math.floor(Math.random() * candidates.length)];
  return { url: photo.src.large, alt: photo.alt };
}

export async function generateContent(systemPrompt: string, userPrompt: string, maxTokens: number = MAX_TOKENS, timeoutMs: number = 45000): Promise<string> {
  const url = "https://api.openai.com/v1/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function generateFromImage(imageUrl: string, prompt: string): Promise<string> {
  const url = "https://api.openai.com/v1/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    signal: AbortSignal.timeout(240000),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq Vision API error: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
