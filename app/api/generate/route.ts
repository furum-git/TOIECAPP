import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, MAX_TOKENS, extractJson } from "@/lib/claude";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { GenerateRequest, GenerateResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body: GenerateRequest = await request.json();
  const { part, count, docType } = body;

  if (!part || !count) {
    return NextResponse.json({ error: "part と count は必須です" }, { status: 400 });
  }

  const userPrompt = buildPrompt(part, count, docType);

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const message = await stream.finalMessage();
  const rawText = message.content.find((b) => b.type === "text")?.text ?? "";

  try {
    const jsonText = extractJson(rawText);
    const data: GenerateResponse = JSON.parse(jsonText);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "JSON パースエラー", raw: rawText },
      { status: 500 }
    );
  }
}
