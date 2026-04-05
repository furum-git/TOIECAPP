import { ToeicPart } from "../types";
import { buildPart1Prompt } from "./part1";
import { buildPart2Prompt } from "./part2";
import { buildPart3Prompt } from "./part3";
import { buildPart4Prompt } from "./part4";
import { buildPart5Prompt } from "./part5";
import { buildPart6Prompt } from "./part6";
import { buildPart7Prompt } from "./part7";

export function buildPrompt(
  part: ToeicPart,
  count: number,
  docType?: "single" | "double" | "triple"
): string {
  switch (part) {
    case 1:
      return buildPart1Prompt(count);
    case 2:
      return buildPart2Prompt(count);
    case 3:
      return buildPart3Prompt(count);
    case 4:
      return buildPart4Prompt(count);
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
- ビジネス英語の文脈を優先する`;
