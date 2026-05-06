import { ToeicPart } from "../types";
import { buildPart1Prompt } from "./part1";
import { buildPart2Prompt } from "./part2";
import { buildPart3Prompt } from "./part3";
import { buildPart4Prompt } from "./part4";
import { buildPart5Prompt } from "./part5";
import { buildPart6Prompt } from "./part6";
import { buildPart7Prompt } from "./part7";

const LETTERS = ["A", "B", "C", "D"] as const;

/** count 問分の正解をシャッフルして返す（A/B/C/Dが均等になるよう循環） */
export function makeAnswerAssignment(count: number): string[] {
  const base = Array.from({ length: count }, (_, i) => LETTERS[i % 4]);
  for (let i = base.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  return base;
}

function answerInstruction(answers: string[]): string {
  const list = answers.map((a, i) => `問${i + 1}: ${a}`).join("、");
  return `\n\n【正解の配分（厳守・変更禁止）】\n以下の通りcorrectAnswerを設定すること: ${list}\nこの配分を必ず守ること。`;
}

export function buildPrompt(
  part: ToeicPart,
  count: number,
  docType?: "single" | "double" | "triple"
): string {
  const questionCount = part === 6 ? 4 : part === 7 ? (docType === "single" ? 3 : 5) : count;
  const answers = makeAnswerAssignment(questionCount);

  switch (part) {
    case 1:
      return buildPart1Prompt(count) + answerInstruction(answers);
    case 2:
      return buildPart2Prompt(count) + answerInstruction(answers);
    case 3:
      return buildPart3Prompt(count) + answerInstruction(answers);
    case 4:
      return buildPart4Prompt(count) + answerInstruction(answers);
    case 5:
      return buildPart5Prompt(count);
    case 6:
      return buildPart6Prompt();
    case 7:
      return buildPart7Prompt(docType ?? "single");
  }
}

export const SYSTEM_PROMPT = `あなたはTOEICテストの問題作成の専門家です。
以下のルールを必ず守ってください：
- 出力は必ず有効なJSONのみ（マークダウンコードブロック不可）
- 選択肢は自然な英語で、明確に区別できるようにする
- 正解は偏りなくA/B/C/Dに分散させる
- 解説は日本語で、なぜ正解かを明確に述べる
- 問題の難易度はTOEIC 600〜800点レベルを目安にする
- ビジネス英語の文脈を優先する

【公平性ルール（最重要）】
- 正解は必ず唯一に定まること。複数の選択肢が「正解にも見える」問題は絶対に作らない
- 誤答選択肢は「惜しいが明確に間違い」であること。「どちらとも言える」は不可
- 文法問題では、問題文に時制・語法を確定させる文脈的手がかりを必ず含める
- 読解問題では、正解の根拠が本文中に明示されていること。推測だけでは導けない選択肢は不可
- 問題を作成後、「別の選択肢も正解ではないか？」と必ず自己チェックすること

【解説フォーマット（必須）】
explanationPerChoiceの各フィールドに必ず日本語解説を書くこと。空文字・省略は絶対禁止。
各解説は「問題文中の根拠となる語句を'...'で引用しながら」理由を説明すること。
例：「'yesterday'が特定の過去時点を示すため現在完了形は使えない」「'has not been'の後に過去分詞が続くため受動態の完了形が正しい」`;
