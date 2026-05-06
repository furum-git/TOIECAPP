export function buildPart1Prompt(count: number): string {
  return `TOEICのPart 1（写真描写問題）を${count}問作成してください。

【形式】
- 写真に写っている場面をテキストで描写する
- 4つの選択肢（A/B/C/D）は写真の描写文
- 誤答には「人物の行動の誤り」「場所の誤り」「対象物の誤り」を混在させる

【主語のバリエーションを必ず混在させること（単調にならないよう）】
- 人物が主語: "A man is carrying a box." / "The woman is talking on the phone."
- 物・複数物が主語: "The chairs are arranged around a table." / "A laptop is placed on the desk." / "Several boxes are stacked near the door."
- 受動態（物が対象）: "The shelves are lined with products." / "The window is being cleaned."
- There is/are構文: "There are several people seated in a row."
- 状態描写: "The room is filled with office furniture."

${count}問中、人物主語・物主語・受動態をバランスよく使うこと。

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p1_001",
      "part": 1,
      "scenario": "写真の描写（例：A man sitting at a desk in an office）",
      "questionText": "What is shown in the photograph?",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "choicesJa": { "A": "（Aの日本語訳）", "B": "（Bの日本語訳）", "C": "（Cの日本語訳）", "D": "（Dの日本語訳）" },
      "correctAnswer": "A",
      "explanation": "【正解A】〜だから正解。\\n【B】〜だから不正解。\\n【C】〜だから不正解。\\n【D】〜だから不正解。"
    }
  ]
}

${count}問分、idは p1_001, p1_002... と連番にしてください。`;
}
