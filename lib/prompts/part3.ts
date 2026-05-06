const SCENARIOS = [
  "同僚間でのプロジェクト進捗の確認",
  "顧客からのクレーム対応",
  "採用面接の調整",
  "オフィス移転の打ち合わせ",
  "製品デモのスケジュール調整",
  "出張の手配と経費確認",
  "社内システム障害のトラブルシューティング",
  "新製品のマーケティング戦略会議",
  "取引先との契約交渉",
  "チームの予算超過についての相談",
  "社員研修プログラムの企画",
  "コンファレンスルームの予約トラブル",
];

export function buildPart3Prompt(count: number): string {
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  return `TOEICのPart 3（会話問題）を1セット作成してください。2〜3人の会話1つに${count}問の設問をつけてください。

【今回のシナリオ】
${scenario}

【会話の形式】
- Man / Woman / Man2 など実名でなく役割名で表記
- 8〜12往復程度のビジネス英語会話
- 自然な口語表現を使い、単調にならないように

【設問タイプを3問で組み合わせる（重複禁止）】
- 会話の目的・概要: "What are the speakers mainly discussing?"
- 詳細・事実確認: "What does the woman say about...?" / "According to the man, what..."
- 次の行動・推測: "What will the man most likely do next?" / "What is suggested about...?"
- 話者の意図: "Why does the woman say, '...quote...'?"
- 図表連動（任意）: "Look at the graphic. Which ... is mentioned?"

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p3_001",
      "part": 3,
      "passage": "Man: ...\\nWoman: ...\\nMan: ...",
      "passageJa": "男性: ...\\n女性: ...\\n男性: ...",
      "questionText": "...",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "choicesJa": { "A": "（日本語訳）", "B": "（日本語訳）", "C": "（日本語訳）", "D": "（日本語訳）" },
      "correctAnswer": "B",
      "explanation": "正解の選択肢とその理由を一文で",
      "explanationPerChoice": {
        "A": "Aが正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
        "B": "Bが正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
        "C": "Cが正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
        "D": "Dが正解なら「正解：〜の理由」、不正解なら「〜だから不正解」"
      }
    }
  ]
}

全${count}問、同じpassageを各questionに含めてください。idは p3_001, p3_002... と連番にしてください。`;
}
