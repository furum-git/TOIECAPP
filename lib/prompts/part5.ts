export function buildPart5Prompt(count: number): string {
  return `TOEICのPart 5（短文穴埋め問題）を${count}問作成してください。

【文法項目を均等に混在させること】
- 品詞問題（名詞/動詞/形容詞/副詞の選択）
- 動詞の時制・態（能動態/受動態、現在/過去/完了）
- 前置詞・接続詞
- 代名詞・関係詞
- 語彙問題（コロケーション）

【形式】
- 文中の空欄（___）に入る最も適切な語を4択で選ぶ
- ビジネス英語の文脈（メール、会議、業務報告等）

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p5_001",
      "part": 5,
      "questionText": "The project manager ___ the report before the deadline.",
      "choices": { "A": "submits", "B": "submitted", "C": "submission", "D": "submitting" },
      "correctAnswer": "B",
      "explanation": "日本語で解説"
    }
  ]
}

${count}問分、idは p5_001, p5_002... と連番にしてください。`;
}
