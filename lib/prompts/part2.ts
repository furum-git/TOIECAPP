export function buildPart2Prompt(count: number): string {
  return `TOEICのPart 2（応答問題）を${count}問作成してください。

【形式】
- 短い発話（疑問文・依頼・提案）に対して最も適切な応答を選ぶ
- 選択肢はA/B/Cの3択（Dは必ず空文字""）
- 誤答は「意味は通じるが文脈が外れる」ものにする
- WH疑問文・Yes/No疑問文・依頼提案文を均等に混ぜる

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p2_001",
      "part": 2,
      "questionText": "（最初の発話）",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "" },
      "correctAnswer": "A",
      "explanation": "日本語で解説"
    }
  ]
}

${count}問分、idは p2_001, p2_002... と連番にしてください。`;
}
