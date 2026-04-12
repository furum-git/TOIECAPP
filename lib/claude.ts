export const MODEL = "llama-3.3-70b-versatile";
export const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
export const MAX_TOKENS = 4096;

const TOEIC_SEARCH_QUERIES = [
  "office workers meeting",
  "business people working",
  "workplace desk computer",
  "people shopping store",
  "construction workers outdoor",
  "restaurant kitchen staff",
  "airport travelers luggage",
  "library reading books",
  "hospital doctor nurse",
  "park outdoor people",
];

export function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

export async function fetchPexelsPhoto(): Promise<{ url: string; alt: string }> {
  const query = TOEIC_SEARCH_QUERIES[Math.floor(Math.random() * TOEIC_SEARCH_QUERIES.length)];
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`,
    { headers: { Authorization: process.env.PEXELS_API_KEY ?? "" } }
  );
  if (!res.ok) throw new Error("Pexels API error");
  const data = await res.json();
  const photos = data.photos as { src: { large: string }; alt: string }[];
  const photo = photos[Math.floor(Math.random() * photos.length)];
  return { url: photo.src.large, alt: photo.alt };
}

export async function generateContent(systemPrompt: string, userPrompt: string): Promise<string> {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
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
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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
