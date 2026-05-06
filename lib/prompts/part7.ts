export function buildPart7Prompt(docType: "single" | "double" | "triple"): string {
  const docCount = docType === "single" ? 1 : docType === "double" ? 2 : 3;
  // singleはp7_001/p7_002の2問のみ生成（p7_003は別途2段階目で挿入問題として生成・差し替え）
  const questionCount = docType === "single" ? 2 : 5;

  const docTypeGuide = docType === "single" ? `
【文書の種類】（以下からランダムに1種選ぶ）
- Eメール・手紙（問い合わせ・依頼・返信）
- 広告（求人・商品・サービス）
- お知らせ・ポリシー・規則（図書館・職場・施設などの掲示物）
- ニュース記事・プレスリリース
- テキストメッセージチェーン（2〜3人の短いやりとり）
- フォーム・アンケート・レポート

【文書の仕様】
- 長さ：150〜250語
- マーカー([1]〜[4])は一切使わない。文書はシンプルな英文のみ
- テキストメッセージ系の場合は「名前 [時刻]: 本文」の形式で3〜5往復
- 文書タイプは毎回バリエーションをつけること（同じタイプを連続して選ばない）` : docType === "double" ? `
【文書の種類】（以下の組み合わせからランダムに1つ選ぶ）
- 広告 × Eメール（商品・サービスの問い合わせ）
- お知らせ × Eメール（イベント・採用の応募）
- 記事 × Eメール（ニュースへの反応・問い合わせ）
- フォーム × Eメール（注文・申込の確認）

【文書の仕様】
- 各文書 100〜180語
- 2文書を \`\\n\\n---\\n\\n\` で区切って1つのpassageフィールドに連結
- 5問中 最低1問は両方の文書を読まないと解けないクロス参照問題にすること` : `
【文書の種類】（以下の組み合わせからランダムに1つ選ぶ）
- 広告 × オンライン注文・ショッピングカート × Eメール
- お知らせ × フォーム × Eメール
- 記事 × アンケート × Eメール

【文書の仕様】
- 各文書 80〜150語
- 3文書を \`\\n\\n---\\n\\n\` で区切って1つのpassageフィールドに連結
- 5問中 最低2問は複数の文書を照合しないと解けないクロス参照問題にすること`;

  const questionTypeGuide = `
【設問番号ごとの型（絶対に守ること）】

◆ single（2問）の場合：
  p7_001のquestionText → 必ず "What is the purpose of" または "What is indicated about" または "According to" または "Who" または "When" で始まること
  p7_002のquestionText → 必ず "What is NOT" で始まること
  ★ singleでは "In which of the positions marked" で始まるquestionTextは絶対禁止
  ★ singleではchoicesに "[1]" "[2]" "[3]" "[4]" を使うことは絶対禁止（英語の選択肢のみ）

◆ double/triple（5問）の場合：
  p7_001 → 事実確認問題
  p7_002 → NOT問題
  p7_003 → 語句の意味問題
  p7_004 → 複数文書照合問題
  p7_005 → 複数文書照合問題 または 文挿入問題（マーカー文書がある場合のみ）
  ★ p7_001〜p7_004は絶対に文挿入問題にしてはならない

【各設問タイプの詳細】

■ 事実確認問題（最頻出）
- "What is the purpose of the e-mail?"
- "According to the article, where is Mr. X from?"
- "What is indicated about X?"
- "What is suggested about X?"
- 正解は本文に明示されていること（推測不要）

■ NOT問題
- "What is NOT mentioned about X?"
- "What is NOT a requirement for Y?"
- 正解以外の3択は本文に明示されており、正解のみ本文に存在しないこと

■ 語句の意味問題
- "The word '[語句]' in paragraph X, line Y, is closest in meaning to..."
- 文脈から1つに絞れる語句を選ぶこと
- 選択肢は同品詞の異なる意味の語4つ

■ テキストメッセージ意図問題（テキストメッセージ文書の場合のみ）
- "At [時刻], what does X mean when he/she writes, '[引用]'?"
- 引用は1〜2語の短いフレーズ（"Sure thing" "Got it" など）
- 選択肢はその発言の意図・解釈を4通り

■ 文挿入問題（double/triple文書のみ・singleでは絶対に使わない・1セットに最大1問）

【文挿入問題の完全な正解例】

以下のpassageとquestionTextのペアが正しい形式:

passage:
"Dear Team,
Please be reminded that the monthly staff meeting will be held next Thursday at 10:00 AM in Conference Room B. — [1] —. Attendance is mandatory for all department members. The agenda will include department updates, project timelines, and upcoming training sessions. — [2] —.
If you have additional topics to discuss, kindly send your suggestions to the HR department by Tuesday afternoon. — [3] —. Please review the attached agenda and come prepared with any relevant updates. — [4] —.
Best regards,
John Smith"

questionText:
"In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? 'Light refreshments will be served during the meeting.'"

→ 「Light refreshments will be served during the meeting.」はpassageに存在しない。
→ マーカーはメール本文の中（Best regards の前）に埋め込まれている。
→ Best regards より後ろにはマーカーも追加文もない。

【絶対禁止パターン（毎回このミスが起きている）】
"...Best regards,
John Smith
— [1] —
Please ensure that your reports are submitted at least two days before the meeting.
— [2] —
All participants are advised to arrive 10 minutes early.
— [3] —
The meeting is expected to last approximately two hours.
— [4] —"
← Best regards の後ろにマーカーと文を追記している → 完全に間違い。絶対にしないこと。

【ルール】
- マーカーは文書本文の内側（Best regards/署名より前）に配置する
- マーカーは文と文の間にインラインで配置し、独立した行にしない
- passageに — [1] — 〜 — [4] — の4つ全てを含めること
- questionTextで引用する文は passageに一切含めないこと

choices: { "A": "[1]", "B": "[2]", "C": "[3]", "D": "[4]" }
choicesJa: { "A": "", "B": "", "C": "", "D": "" }
questionTextJa: 引用文の日本語訳のみ

■ 複数文書照合問題（double/tripleのみ）
- "What can be inferred about X from the documents?"
- "What does X most likely do for a living?"（両方の文書から導ける）
- 単一文書だけでは解けないこと`;

  const antiPatterns = `
【誤答選択肢のルール】
- 本文の語句を含むが内容が異なるもの（パラフレーズトラップ）
- 本文に登場するが設問と無関係な情報
- 正しそうだが本文に根拠がない推測
- 「どちらとも読める」曖昧な選択肢は禁止
- 正解は本文から一意に特定できること`;

  const schema = `
【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）

{
  "questions": [
    {
      "id": "p7_001",
      "part": 7,
      "passage": "（文書全文・英語${docType !== "single" ? "。複数文書は \\n\\n---\\n\\n で区切る。文挿入問題がある場合は — [1] — — [2] — — [3] — — [4] — の4つ全てを含める" : ""}）",
      "passageJa": "（文書全文・日本語訳${docType !== "single" ? "。複数文書は \\n\\n---\\n\\n で区切る。マーカーはそのまま残す" : ""}）",
      "questionText": "（設問文${docType !== "single" ? "。文挿入問題の場合は末尾に挿入すべき英文を引用符で記載" : ""}）",
      "choices": {
        "A": "（英語の選択肢A）",
        "B": "（英語の選択肢B）",
        "C": "（英語の選択肢C）",
        "D": "（英語の選択肢D）"
      },
      "choicesJa": {
        "A": "（日本語訳）",
        "B": "（日本語訳）",
        "C": "（日本語訳）",
        "D": "（日本語訳）"
      },
      "correctAnswer": "A",
      "explanation": "正解の理由を一文で（本文の根拠となる箇所を引用して）",
      "explanationPerChoice": {
        "A": "正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
        "B": "正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
        "C": "正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
        "D": "正解なら「正解：〜の理由」、不正解なら「〜だから不正解」"
      }
    }
  ]
}

【出力前の必須チェック】
${questionCount === 2 ? `- p7_001のquestionTextが "What is the purpose" / "What is indicated" / "According to" / "Who" / "When" のいずれかで始まっているか？ → NO → 作り直すこと
- p7_002のquestionTextが "What is NOT" で始まっているか？ → NO → 作り直すこと
- choicesに "[1]" "[2]" "[3]" "[4]" が含まれていないか？ → YES → 英語の選択肢に作り直すこと` : `- p7_001〜p7_004のいずれかが "In which of the positions marked" で始まっていないか？ → YES → 作り直すこと
- 文挿入問題がある場合(p7_005のみ): passageに — [1] — 〜 — [4] — が4つ全て含まれているか？
- 【最重要】文挿入問題: questionTextの'...'で引用した文がpassageに存在したら作り直すこと
- 文挿入問題のquestionTextJaに挿入文の日本語訳が記載されているか？`}
- ${questionCount}問分のpassageが全て同じ文書全文であるか？

${questionCount}問分、同じpassageを各questionに含めてください。idは p7_001〜p7_00${questionCount} としてください。
マークダウンコードブロック不可。JSONのみ出力。`;

  return `TOEICのPart 7（読解問題）を1セット作成してください。
文書タイプ: ${docType}（${docCount}文書）、設問数: ${questionCount}問${docType === "single" ? "（文挿入問題は別途追加するため、ここでは事実確認・NOT問題の2問のみ生成）" : ""}
${docTypeGuide}
${questionTypeGuide}
${antiPatterns}
${schema}`;
}

/**
 * 2段階目：既存passageから文挿入問題を1問生成するプロンプト
 * singleの場合のみ使用。passageの文を1つ選んで削除し、マーカーを埋め込む。
 */
export function buildPart7InsertionPrompt(passage: string, passageJa: string, qId: string): string {
  return `以下のTOEIC Part 7の文書を使って、文挿入問題を1問作成してください。

【元の文書（英語）】
${passage}

【元の文書（日本語訳）】
${passageJa}

【STEP1: 挿入文の選び方（重要）】
以下の条件を満たす文を1文選ぶこと：
- 前後の文脈と明確な接続がある文（代名詞・接続詞・指示語・時系列・因果関係など）
  例：「This will allow employees to...」（前文の施策に言及）
  例：「Additionally, all attendees should...」（追加事項）
  例：「Therefore, the deadline has been extended.」（前文の理由を受けた結論）
- 正解位置が文脈から一意に特定できること（「どこでもあてはまる」文は不可）
- 毎回異なる種類の補足情報を選ぶこと（手順・理由・期限・連絡先・例外規定など）

【STEP2〜4: 手順（厳守）】
STEP2: STEP1で選んだ文を文書から完全に削除する（passageに含めてはならない）
STEP3: 削除した位置を含む4箇所に — [1] — 〜 — [4] — を文と文の間にインラインで追加する
  - マーカーは署名（Best regards等）より前の本文内に配置すること
  - マーカー単独の行にしないこと（前後の文と連結すること）
  - 連続するマーカーは禁止：— [1] — と — [2] — の間には必ず1文以上入れること
STEP4: questionTextにSTEP1で選んだ文を引用符 '...' で囲んで記載する

確認: passageにSTEP1で選んだ文が含まれていないこと（含まれていたら作り直す）

【出力JSONフォーマット】
{
  "id": "${qId}",
  "part": 7,
  "passage": "（STEP2でSTEP1の文を削除し、STEP3でマーカー4つを追加した文書全文）",
  "passageJa": "（同上の日本語訳。マーカーはそのまま残す）",
  "questionText": "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? '（STEP1で選んだ文）'",
  "questionTextJa": "（STEP1で選んだ文の日本語訳のみ）",
  "choices": { "A": "[1]", "B": "[2]", "C": "[3]", "D": "[4]" },
  "choicesJa": { "A": "", "B": "", "C": "", "D": "" },
  "correctAnswer": "（正解位置のA/B/C/D）",
  "explanation": "正解の理由を一文で（本文の前後関係を根拠に）",
  "explanationPerChoice": {
    "A": "正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
    "B": "正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
    "C": "正解なら「正解：〜の理由」、不正解なら「〜だから不正解」",
    "D": "正解なら「正解：〜の理由」、不正解なら「〜だから不正解」"
  }
}

JSONのみ出力。マークダウンコードブロック不可。`;
}
