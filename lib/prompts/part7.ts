export function buildPart7Prompt(docType: "single" | "double" | "triple"): string {
  const docCount = docType === "single" ? 1 : docType === "double" ? 2 : 3;
  const questionCount = docType === "single" ? 3 : 5;

  return `TOEICのPart 7（読解問題）を1セット作成してください。
文書タイプ: ${docType}（${docCount}文書）、設問数: ${questionCount}問

【文書の種類】（複数文書の場合は種類を組み合わせること）
- Eメール・手紙
- 広告・チラシ
- お知らせ・案内
- 記事・レポート
- フォーム・アンケート

【設問タイプを混在させること】
- 目的・主題問題: "What is the main purpose of...?"
- 詳細情報問題: "According to the notice, when will...?"
- 語句推測問題: "The word 'X' in paragraph 2 is closest in meaning to...?"
- NOT問題: "What is NOT mentioned about...?"
${docType !== "single" ? '- 複数文書照合問題: "What can be inferred from both documents?"' : ""}

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）
{
  "questions": [
    {
      "id": "p7_001",
      "part": 7,
      "passage": "（文書全文。複数文書の場合は\\n\\n---\\n\\nで区切って連結）",
      "questionText": "...",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "D",
      "explanation": "日本語で解説"
    }
  ]
}

${questionCount}問分、同じpassageを各questionに含めてください。idは p7_001〜p7_00${questionCount} としてください。`;
}
