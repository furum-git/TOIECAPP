const SCENARIOS = [
  "ラジオの交通情報アナウンス",
  "電話の自動応答メッセージ（営業時間・サービス案内）",
  "社内向けアナウンス（設備工事・移転・イベント告知）",
  "ツアーガイドによる観光地の説明",
  "会議冒頭の司会者による進行案内",
  "ポッドキャストのビジネストピック紹介",
  "空港・駅のアナウンス（遅延・乗り換え案内）",
  "新入社員向けオリエンテーションの説明",
  "製品発表会でのプレゼンテーション冒頭",
  "ラジオのニュース速報",
  "医療機関の自動案内メッセージ",
  "博物館・展示会の音声ガイド",
];

export function buildPart4Prompt(count: number): string {
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  return `TOEICのPart 4（説明文問題）を1セット作成してください。トーク1つに${count}問の設問をつけてください。

【今回のシナリオ】
${scenario}

【形式】
- 1人の話者による説明文（会話ではなくモノローグ）
- 120〜150語程度の自然な英語
- ビジネス英語の文脈

【設問タイプを${count}問で組み合わせる（重複禁止）】
- トークの目的・概要: "What is the purpose of this talk?"
- 詳細・事実確認: "What does the speaker say about...?" / "According to the speaker, what..."
- 次の行動・推測: "What are listeners asked to do?" / "What will most likely happen next?"
- 話者の意図: "Why does the speaker mention '...quote...'?"
- 特定情報: "What time/Where/Who/How many..."

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p4_001",
      "part": 4,
      "scenario": "（トークの種類と状況説明・日本語）",
      "passage": "（トーク全文・英語）",
      "passageJa": "（トーク全文・日本語訳）",
      "questionText": "...",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "choicesJa": { "A": "（日本語訳）", "B": "（日本語訳）", "C": "（日本語訳）", "D": "（日本語訳）" },
      "correctAnswer": "C",
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

全${count}問、同じpassage・scenario・passageJaを各questionに含めてください。idは p4_001, p4_002... と連番にしてください。`;
}
