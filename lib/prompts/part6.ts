export function buildPart6Prompt(): string {
  return `TOEICのPart 6（長文穴埋め問題）を1セット作成してください。1文書に空欄4つ、計4問です。

【文書の種類からランダムに1つ選ぶ】
- ビジネスメール
- 社内通知・メモ
- 広告文・案内文
- 記事・レポート

【形式】
- 文書は150〜200語、空欄は(1)〜(4)の4箇所
- 語彙/文法問題 × 3、文選択問題（文脈から適切な1文を選ぶ）× 1

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p6_001",
      "part": 6,
      "passage": "Dear Mr. Smith,\\n\\nI am writing to (1)___ our meeting...",
      "questionText": "(1) Which word best completes the sentence?",
      "choices": { "A": "confirm", "B": "confine", "C": "confuse", "D": "confer" },
      "correctAnswer": "A",
      "explanation": "日本語で解説"
    }
  ]
}

4問分、同じpassageを各questionに含めてください。idは p6_001〜p6_004 としてください。`;
}
