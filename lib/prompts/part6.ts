export function buildPart6Prompt(): string {
  return `TOEICのPart 6（長文穴埋め問題）を1セット作成してください。1文書に空欄4つ、計4問です。

【文書の種類からランダムに1つ選ぶ】
- ビジネスメール・手紙
- 社内通知・メモ
- 求人広告
- ニュース記事・プレスリリース
- 製品・サービスの案内文

【文書の仕様】
- 長さ：100〜150語
- 空欄は (1)___ (2)___ (3)___ (4)___ の4箇所
- ビジネス英語の自然な文脈

【問題タイプ（1セット4問の内訳・順序厳守）】

■ (1)：文法問題
- 空欄の前後だけで解ける品詞・語形の問題
- 選択肢は同語根の異なる品詞4択（例：interest / interests / interested / interesting）
- 文の構造から品詞が一意に決まること

■ (2)：語彙選択問題
- 品詞は同じで意味の異なる語4択
- 空欄を含む1文の文脈から意味が決まる
- 例：develop / obtain / reduce / maintain（どれも動詞だが意味が異なる）

■ (3)：接続詞・副詞問題
- 接続詞・接続副詞・前置詞句など、文と文のつながりを問う
- 前後の文脈・論理関係（逆接・追加・因果など）から正解が決まる
- 例：However / Therefore / At the same time / In addition

■ (4)：文選択問題（文挿入型）
- 文章の流れに最も合う1文を選ぶ
- 空欄 (4)___ は必ず文と文の間に独立した1行として配置すること（文の途中に入れない）
  良い例：「...Please send us your résumé by Friday.\n(4)___\nWe look forward to hearing from you.」
  悪い例：「...the position which (4)___ requires strong communication skills.」← 禁止
- 選択肢は完全な1文4つ（主語＋動詞を含む）
- 正解以外の3択は、前後の流れ・時制・論理と明確に矛盾すること

【共通ルール】
- 誤答はそれぞれ明確な理由で弾けること（「どちらも正解に見える」選択肢は作らない）
- 正解は文法・語彙・文脈から唯一に定まること
- choicesJa：(1)(2)(3)は単語・句の日本語訳、(4)は文全体の日本語訳
- 以下のJSONスキーマはフォーマット例。内容・単語・テーマはすべて独自に作成すること

【必須チェック（出力前に確認）】
- passageに (1)___ (2)___ (3)___ (4)___ の4つが全て含まれているか？
- 4問すべてのpassageフィールドが一字一句同じ文書全文か？
- p6_001〜p6_004 の questionText と choices はすべて異なるか？
- (4)___ は独立した行に配置されているか？
- 満たさない場合は作り直すこと

【JSONスキーマ】（マークダウンコードブロック不可、JSONのみ出力）

4問の形式：
- p6_001（文法）:    questionText = "(1) Which word best completes the sentence?"
- p6_002（語彙）:    questionText = "(2) Which word best completes the sentence?"
- p6_003（接続詞）:  questionText = "(3) Which word or phrase best completes the sentence?"
- p6_004（文選択）:  questionText = "(4) Which sentence best fits in the blank?"

{
  "questions": [
    {
      "id": "p6_001",
      "part": 6,
      "passage": "（100〜150語の完全オリジナル文書。空欄は (1)___ (2)___ (3)___ の語句レベルと、独立行の (4)___ を含む）",
      "passageJa": "（上記文書の日本語訳全文。空欄は (1)___ (2)___ (3)___ (4)___ のまま残す）",
      "questionText": "(1) Which word best completes the sentence?",
      "choices": { "A": "（語根Xの品詞1）", "B": "（語根Xの品詞2）", "C": "（語根Xの品詞3）", "D": "（語根Xの品詞4）" },
      "choicesJa": { "A": "（日本語訳）", "B": "（日本語訳）", "C": "（日本語訳）", "D": "（日本語訳）" },
      "correctAnswer": "文法的に正しい品詞のアルファベット",
      "explanation": "正解の理由を一文で",
      "explanationPerChoice": { "A": "〜", "B": "〜", "C": "〜", "D": "〜" }
    },
    {
      "id": "p6_002",
      "part": 6,
      "passage": "（p6_001のpassageと一字一句同じ文書全文を繰り返す）",
      "passageJa": "（p6_001のpassageJaと一字一句同じ日本語訳を繰り返す）",
      "questionText": "(2) Which word best completes the sentence?",
      "choices": { "A": "（同品詞・異意味の語1）", "B": "（同品詞・異意味の語2）", "C": "（同品詞・異意味の語3）", "D": "（同品詞・異意味の語4）" },
      "choicesJa": { "A": "（日本語訳）", "B": "（日本語訳）", "C": "（日本語訳）", "D": "（日本語訳）" },
      "correctAnswer": "文脈から唯一正解となるアルファベット",
      "explanation": "正解の理由を一文で",
      "explanationPerChoice": { "A": "〜", "B": "〜", "C": "〜", "D": "〜" }
    },
    {
      "id": "p6_003",
      "part": 6,
      "passage": "（p6_001のpassageと一字一句同じ文書全文を繰り返す）",
      "passageJa": "（p6_001のpassageJaと一字一句同じ日本語訳を繰り返す）",
      "questionText": "(3) Which word or phrase best completes the sentence?",
      "choices": { "A": "（接続表現1）", "B": "（接続表現2）", "C": "（接続表現3）", "D": "（接続表現4）" },
      "choicesJa": { "A": "（日本語訳）", "B": "（日本語訳）", "C": "（日本語訳）", "D": "（日本語訳）" },
      "correctAnswer": "論理関係から正しい接続表現のアルファベット",
      "explanation": "正解の理由を一文で",
      "explanationPerChoice": { "A": "〜", "B": "〜", "C": "〜", "D": "〜" }
    },
    {
      "id": "p6_004",
      "part": 6,
      "passage": "（p6_001のpassageと一字一句同じ文書全文を繰り返す）",
      "passageJa": "（p6_001のpassageJaと一字一句同じ日本語訳を繰り返す）",
      "questionText": "(4) Which sentence best fits in the blank?",
      "choices": { "A": "（完全な文1）", "B": "（完全な文2）", "C": "（完全な文3）", "D": "（完全な文4）" },
      "choicesJa": { "A": "（文の日本語訳）", "B": "（文の日本語訳）", "C": "（文の日本語訳）", "D": "（文の日本語訳）" },
      "correctAnswer": "文章の流れに最も合う文のアルファベット",
      "explanation": "正解の理由を一文で",
      "explanationPerChoice": { "A": "〜", "B": "〜", "C": "〜", "D": "〜" }
    }
  ]
}

上記のJSONを、p6_001〜p6_004の4問すべて埋めた形で出力してください。マークダウンコードブロック不可。JSONのみ出力。`;
}
