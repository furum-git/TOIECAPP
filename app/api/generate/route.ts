import { NextRequest, NextResponse } from "next/server";
import { generateContent, generateFromImage, fetchPexelsPhoto, extractJson } from "@/lib/claude";
import { buildPrompt, makeAnswerAssignment, SYSTEM_PROMPT } from "@/lib/prompts";
import { buildPart7InsertionPrompt } from "@/lib/prompts/part7";
import { GenerateRequest, GenerateResponse, ToeicQuestion } from "@/lib/types";

const PART1_VISION_PROMPT = (count: number, forcedAnswer: string) => `You are a TOEIC test expert. Look at this photo carefully and create ${count} TOEIC Part 1 questions.

Rules:
- questionText must always be "What is shown in the photograph?"
- correctAnswer MUST be "${forcedAnswer}" — place the correct description at choice ${forcedAnswer}, other choices must be wrong.
- The correct choice: accurately describes the MOST PROMINENT action or scene in the photo
- 3 wrong choices: must describe things that are CLEARLY NOT happening in the photo (wrong location, wrong activity, wrong subject). A wrong choice must be impossible to argue as correct based on the photo.
- CRITICAL: All 4 choices must be completely different sentences. Never repeat or reuse the same wording.
- Before writing wrong choices, ask yourself: "Could someone argue this is also true in the photo?" If yes, change it.
- Vary the subject of sentences: people (A man is..., Someone is...), objects (The chairs are..., A box is placed...), passive voice (The shelves are lined with...), There is/are constructions.
- explanation must be in Japanese per choice format: "【正解X】〜だから正解。\\n【A/B/C/D】〜だから不正解。" etc.
- Include choicesJa with Japanese translation of each choice
- Output ONLY valid JSON, no markdown

JSON format:
{
  "questions": [
    {
      "id": "p1_001",
      "part": 1,
      "questionText": "What is shown in the photograph?",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "choicesJa": { "A": "（日本語訳）", "B": "（日本語訳）", "C": "（日本語訳）", "D": "（日本語訳）" },
      "correctAnswer": "A",
      "explanation": "【正解A】〜だから正解。\\n【B】〜だから不正解。\\n【C】〜だから不正解。\\n【D】〜だから不正解。"
    }
  ]
}

Generate ${count} questions with ids p1_001, p1_002... and so on.`;

function hasDuplicateChoices(questions: ToeicQuestion[]): boolean {
  return questions.some((q) => {
    const vals = Object.values(q.choices).filter((v) => v !== "");
    return new Set(vals).size !== vals.length;
  });
}

function hasInsertionStyleChoices(q: ToeicQuestion): boolean {
  return Object.values(q.choices).some((v) => /^\[\d\]/.test(v.trim()));
}

/** p7_001/p7_002の選択肢から [N] プレフィックスを除去する */
function cleanChoices(q: ToeicQuestion): ToeicQuestion {
  const choices = { ...q.choices };
  for (const k of ["A", "B", "C", "D"] as const) {
    if (choices[k]) choices[k] = choices[k].replace(/^\[\d+\]\s*/, "").trim();
  }
  return { ...q, choices };
}

const MARKERS = ["— [1] —", "— [2] —", "— [3] —", "— [4] —"] as const;
const SIG_PATTERNS = ["Best regards", "Sincerely", "Kind regards", "Yours sincerely", "Warm regards"];

/** passageから挿入文を削除して返す */
function removeSentenceFromPassage(passage: string, sentence: string): string {
  const escaped = sentence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return passage.replace(new RegExp(`\\s*${escaped}\\s*`, "i"), " ").replace(/\s{2,}/g, " ").trim();
}

/** マーカー位置リストに最小間隔を強制する */
function spreadPositions(positions: number[], n: number, minGap = 2): number[] {
  const result = [...positions].sort((a, b) => a - b);
  for (let i = 1; i < result.length; i++) {
    if (result[i] < result[i - 1] + minGap) result[i] = result[i - 1] + minGap;
  }
  for (let i = result.length - 1; i >= 0; i--) {
    const maxAllowed = n - 1 - (result.length - 1 - i) * minGap;
    if (result[i] > maxAllowed) result[i] = maxAllowed;
    if (i > 0 && result[i] < result[i - 1] + minGap) result[i] = result[i - 1] + minGap;
  }
  return result;
}

/** passageに不足しているマーカーを文境界に追加して返す。correctAnswerも再計算する */
function ensureFourMarkers(
  passage: string,
  origPassage: string,
  insertedSentence: string,
  aiCorrectAnswer: string
): { passage: string; correctAnswer: "A" | "B" | "C" | "D" } {
  // 既に4つ揃っている場合も間隔チェック → 必要なら再配置
  const existingCount = MARKERS.filter((m) => passage.includes(m)).length;

  // 署名より前のbodyを抽出
  let bodyEnd = passage.length;
  for (const sig of SIG_PATTERNS) {
    const idx = passage.indexOf(sig);
    if (idx !== -1 && idx < bodyEnd) bodyEnd = idx;
  }
  const body = passage.slice(0, bodyEnd).replace(/\s*—\s*\[\d\]\s*—\s*/g, " ").replace(/\s+/g, " ").trim();
  const closing = passage.slice(bodyEnd);

  // 文に分割（前後スペースを除去して均一化）
  const sentences = (body.match(/[^.!?]+[.!?]+/g) ?? [body]).map(s => s.trim());
  const n = sentences.length;
  if (n < 4) return { passage, correctAnswer: (aiCorrectAnswer as "A" | "B" | "C" | "D") || "A" };

  // passageが短い場合はMIN_GAP=1にフォールバック
  const minGap = n >= 7 ? 2 : 1;

  // 4つの均等分散初期位置
  const evenPositions = [
    Math.floor(n * 0.15),
    Math.floor(n * 0.40),
    Math.floor(n * 0.65),
    Math.floor(n * 0.85),
  ];

  let positions: number[];
  let correctAnswer: "A" | "B" | "C" | "D";

  const origIdx = origPassage.indexOf(insertedSentence.slice(0, 20));

  if (origIdx >= 0) {
    // 元passageに存在する文 → 相対位置から正解を算出
    const relPos = origIdx / origPassage.length;
    const correctSentIdx = Math.min(Math.floor(relPos * n), n - 1);
    positions = [...evenPositions];
    const nearestIdx = positions.reduce((best, pos, i) =>
      Math.abs(pos - correctSentIdx) < Math.abs(positions[best] - correctSentIdx) ? i : best, 0
    );
    positions[nearestIdx] = correctSentIdx;
    positions.sort((a, b) => a - b);
    positions = spreadPositions(positions, n, minGap);
    const correctPosIdx = positions.reduce((best, pos, i) =>
      Math.abs(pos - correctSentIdx) < Math.abs(positions[best] - correctSentIdx) ? i : best, 0
    );
    correctAnswer = (["A", "B", "C", "D"][correctPosIdx] ?? "A") as "A" | "B" | "C" | "D";
  } else {
    // AIが新たに作った文 → AIのcorrectAnswerを尊重して正解位置を確保
    const aiIdx = ["A", "B", "C", "D"].indexOf(aiCorrectAnswer);
    const targetIdx = aiIdx >= 0 ? aiIdx : 1;
    positions = [...evenPositions];
    positions[targetIdx] = evenPositions[targetIdx]; // 均等位置を維持
    positions = spreadPositions(positions, n, minGap);
    correctAnswer = (["A", "B", "C", "D"][targetIdx] ?? "B") as "A" | "B" | "C" | "D";
  }

  const result = sentences.map((s, i) => {
    const mi = positions.indexOf(i);
    return mi >= 0 ? s.trimEnd() + ` — [${mi + 1}] —` : s;
  });

  // 署名の前に改行を確保
  const sep = closing && !/^\s/.test(closing) ? "\n" : "";
  return { passage: result.join(" ") + sep + closing, correctAnswer };
}

/** 文挿入問題の後処理：センテンス削除＋マーカー補完＋間隔チェック */
function fixInsertionQuestion(
  q: ToeicQuestion,
  origPassage: string
): ToeicQuestion {
  const match = q.questionText?.match(/['"](.{10,}?)['"]\s*$/);
  const insertedSentence = match?.[1]?.trim() ?? "";
  if (!insertedSentence) return q;

  // origPassageをベースにする（AIがpassageに余計な文を追加するのを防ぐ）
  const basePassage = removeSentenceFromPassage(origPassage, insertedSentence);

  const { passage: fixedPassage, correctAnswer } = ensureFourMarkers(
    basePassage, origPassage, insertedSentence, q.correctAnswer
  );

  // explanationが間違った選択肢の文字に言及していたらクリア
  let explanation = q.explanation ?? "";
  const explLetter = explanation.match(/\[([A-D])\]/)?.[1];
  if (explLetter && explLetter !== correctAnswer) explanation = "";

  return { ...q, passage: fixedPassage, correctAnswer, explanation };
}

export async function POST(request: NextRequest) {
  const body: GenerateRequest = await request.json();
  const { part, count, docType } = body;

  if (!part || (!count && ![6, 7].includes(part))) {
    return NextResponse.json({ error: "part と count は必須です" }, { status: 400 });
  }

  try {
    if (part === 1) {
      const part1Answers = makeAnswerAssignment(count);
      const results = await Promise.all(
        Array.from({ length: count }, async (_, i) => {
          const photo = await fetchPexelsPhoto();
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              const rawText = await generateFromImage(photo.url, PART1_VISION_PROMPT(1, part1Answers[i]));
              const jsonText = extractJson(rawText);
              const data: GenerateResponse = JSON.parse(jsonText);
              const q = data.questions[0];
              if (hasDuplicateChoices([q]) && attempt < 2) continue;
              return {
                ...q,
                id: `p1_${String(i + 1).padStart(3, "0")}`,
                imageUrl: photo.url,
              } as ToeicQuestion;
            } catch {
              if (attempt === 2) throw new Error("Part1 JSON parse failed after 3 attempts");
            }
          }
        })
      );
      return NextResponse.json({ questions: results });
    }

    const userPrompt = buildPrompt(part, count, docType);
    const maxTokens = [2, 5].includes(part) ? 5000 : 8192;
    const timeoutMs = [6, 7].includes(part) ? 240000 : 180000;
    let data: GenerateResponse | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const rawText = await generateContent(SYSTEM_PROMPT, userPrompt, maxTokens, timeoutMs);
      const jsonText = extractJson(rawText);
      try {
        const parsed: GenerateResponse = JSON.parse(jsonText);
        const invalid =
          hasDuplicateChoices(parsed.questions) ||
          (part === 7 && docType === "single" && parsed.questions.slice(0, 2).some(hasInsertionStyleChoices));
        if (invalid && attempt < 2) continue;
        if (invalid) throw new Error("Generated choices failed validation");
        data = parsed;
        break;
      } catch {
        if (attempt === 2) throw new Error("JSON parse failed after 3 attempts");
      }
    }

    // single Part 7: p7_001/p7_002 の選択肢から [N] プレフィックスを除去
    if (part === 7 && docType === "single" && data) {
      data.questions = data.questions.map(cleanChoices);
    }

    // single Part 7: p7_003 を2段階生成で文挿入問題に差し替え
    if (part === 7 && docType === "single" && data) {
      const origPassage = data.questions[0].passage ?? "";
      const passageJa = data.questions[0].passageJa ?? "";
      if (origPassage) {
        let insertionQ: ToeicQuestion | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const insertPrompt = buildPart7InsertionPrompt(origPassage, passageJa, "p7_003");
            const rawText = await generateContent(SYSTEM_PROMPT, insertPrompt, 4096, 180000);
            const jsonText = extractJson(rawText);
            const parsed = JSON.parse(jsonText) as ToeicQuestion;
            // 後処理：挿入文削除＋マーカー補完
            const fixed = fixInsertionQuestion(parsed, origPassage);
            // 最終バリデーション：4つのマーカーが揃っているか
            const markerCount = MARKERS.filter((m) => fixed.passage?.includes(m)).length;
            if (markerCount < 4 && attempt < 2) continue;
            insertionQ = fixed;
            break;
          } catch {
            if (attempt === 4) console.error("文挿入問題生成失敗");
          }
        }
        if (insertionQ) {
          const markedPassage = insertionQ.passage ?? origPassage;
          const markedPassageJa = insertionQ.passageJa ?? passageJa;
          data.questions = data.questions.map((q) => ({
            ...q,
            passage: markedPassage,
            passageJa: markedPassageJa,
          }));
          data.questions[2] = { ...insertionQ, id: "p7_003" };
        }
      }
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "問題生成に失敗しました。時間をおいてもう一度お試しください。" }, { status: 500 });
  }
}
