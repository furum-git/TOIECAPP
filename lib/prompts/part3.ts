export function buildPart3Prompt(count: number): string {
  return `TOEICのPart 3（会話問題）を1セット作成してください。2〜3人の会話1つに${count}問の設問をつけてください。

【会話の形式】
- Man/Woman/Narratorなど2〜3人の会話
- 7〜10往復程度のビジネス英語会話

【設問タイプを混在】
- 会話の目的: "What is the purpose of this conversation?"
- 詳細理解: "What does the man say about X?"
- 推測: "What will they probably do next?"
- 特定情報: "What time/Where/Who..."

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p3_001",
      "part": 3,
      "passage": "Man: ...\\nWoman: ...\\nMan: ...",
      "questionText": "...",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "B",
      "explanation": "日本語で解説"
    }
  ]
}

全${count}問、同じpassageを各questionに含めてください。idは p3_001, p3_002... と連番にしてください。`;
}
