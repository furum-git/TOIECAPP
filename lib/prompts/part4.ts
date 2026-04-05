export function buildPart4Prompt(count: number): string {
  return `TOEICのPart 4（説明文問題）を1セット作成してください。トーク1つに${count}問の設問をつけてください。

【トークの種類からランダムに1つ選ぶ】
- ラジオ放送（天気・交通・ニュース）
- 電話の自動応答メッセージ
- 社内アナウンス
- ツアーガイドの説明

【形式】
- トーク本文は120〜150語程度
- 設問タイプ: 話者の意図・詳細情報・次にすること

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p4_001",
      "part": 4,
      "scenario": "（トークの種類と状況説明）",
      "passage": "（トーク全文）",
      "questionText": "...",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "C",
      "explanation": "日本語で解説"
    }
  ]
}

全${count}問、同じpassageとscenarioを各questionに含めてください。idは p4_001, p4_002... と連番にしてください。`;
}
