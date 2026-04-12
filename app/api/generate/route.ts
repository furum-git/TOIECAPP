import { NextRequest, NextResponse } from "next/server";
import { generateContent, generateFromImage, fetchPexelsPhoto, extractJson } from "@/lib/claude";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { GenerateRequest, GenerateResponse, ToeicQuestion } from "@/lib/types";

const PART1_VISION_PROMPT = (count: number) => `You are a TOEIC test expert. Look at this photo carefully and create ${count} TOEIC Part 1 questions.

Rules:
- questionText must always be "What is shown in the photograph?"
- 4 choices (A/B/C/D): one correct description of the photo, three plausible but wrong descriptions
- Use present continuous tense (Someone is doing...)
- correctAnswer should be the choice that accurately describes the photo
- explanation must be in Japanese, explaining why the correct answer matches the photo
- Output ONLY valid JSON, no markdown

JSON format:
{
  "questions": [
    {
      "id": "p1_001",
      "part": 1,
      "questionText": "What is shown in the photograph?",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A",
      "explanation": "日本語の解説"
    }
  ]
}

Generate ${count} questions with ids p1_001, p1_002... and so on.`;

export async function POST(request: NextRequest) {
  const body: GenerateRequest = await request.json();
  const { part, count, docType } = body;

  if (!part || !count) {
    return NextResponse.json({ error: "part と count は必須です" }, { status: 400 });
  }

  try {
    if (part === 1) {
      const results = await Promise.all(
        Array.from({ length: count }, async (_, i) => {
          const photo = await fetchPexelsPhoto();
          const rawText = await generateFromImage(photo.url, PART1_VISION_PROMPT(1));
          const jsonText = extractJson(rawText);
          const data: GenerateResponse = JSON.parse(jsonText);
          const q = data.questions[0];
          return {
            ...q,
            id: `p1_${String(i + 1).padStart(3, "0")}`,
            imageUrl: photo.url,
          } as ToeicQuestion;
        })
      );
      return NextResponse.json({ questions: results });
    }

    const userPrompt = buildPrompt(part, count, docType);
    const rawText = await generateContent(SYSTEM_PROMPT, userPrompt);
    const jsonText = extractJson(rawText);
    const data: GenerateResponse = JSON.parse(jsonText);
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "問題生成エラー" }, { status: 500 });
  }
}
