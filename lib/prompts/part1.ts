export function buildPart1Prompt(count: number): string {
  return `TOEICのPart 1（写真描写問題）を${count}問作成してください。

【形式】
- 写真に写っている場面をテキストで描写する（例：「男性がコーヒーを飲んでいる写真」）
- 4つの選択肢（A/B/C/D）は写真の描写文
- 選択肢は全て現在進行形（Someone is .../The man is ...など）を基本とする
- 誤答には「人物の行動の誤り」「場所の誤り」「対象物の誤り」を混在させる

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p1_001",
      "part": 1,
      "scenario": "写真の描写（例：A man sitting at a desk in an office）",
      "questionText": "What is shown in the photograph?",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A",
      "explanation": "日本語で解説"
    }
  ]
}

${count}問分、idは p1_001, p1_002... と連番にしてください。`;
}
