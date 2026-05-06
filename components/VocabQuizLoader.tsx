"use client";

import { useState, useMemo, useEffect } from "react";

type VocabEntry = {
  word: string;
  pos: string; // 品詞
  meaning: string;
  wrongChoices: string[];
  example: string;
  exampleJa: string;
  etymology: string;
};

const VOCAB_LIST: VocabEntry[] = [
  {
    word: "acquire",
    pos: "動詞",
    meaning: "取得する・習得する",
    wrongChoices: ["拒否する", "報告する", "減少させる"],
    example: "She acquired new skills through the training program.",
    exampleJa: "彼女はトレーニングプログラムを通じて新しいスキルを習得した。",
    etymology: "ラテン語 acquirere（ad- 向かって + quaerere 求める）→「求めて手に入れる」",
  },
  {
    word: "adjacent",
    pos: "形容詞",
    meaning: "隣接した・近接した",
    wrongChoices: ["廃止された", "優れた", "詳細な"],
    example: "The conference room is adjacent to the main office.",
    exampleJa: "会議室はメインオフィスに隣接している。",
    etymology: "ラテン語 adjacens（ad- 近くに + jacere 横たわる）→「そばに横たわっている」",
  },
  {
    word: "allocate",
    pos: "動詞",
    meaning: "割り当てる・配分する",
    wrongChoices: ["削除する", "輸出する", "延期する"],
    example: "The manager allocated the budget to each department.",
    exampleJa: "マネージャーは各部署に予算を割り当てた。",
    etymology: "ラテン語 allocare（ad- + locare 場所に置く）→「各場所に置く」",
  },
  {
    word: "amendment",
    pos: "名詞",
    meaning: "修正・改正",
    wrongChoices: ["契約", "報酬", "否決"],
    example: "The committee proposed an amendment to the existing policy.",
    exampleJa: "委員会は既存の方針への修正を提案した。",
    etymology: "ラテン語 emendare（e- 外に + menda 欠点）→「欠点を取り除く」が語源",
  },
  {
    word: "anticipate",
    pos: "動詞",
    meaning: "予期する・期待する",
    wrongChoices: ["確認する", "反論する", "延長する"],
    example: "We anticipate strong demand for the new product.",
    exampleJa: "私たちは新製品への強い需要を予期している。",
    etymology: "ラテン語 anticipare（ante- 前に + capere 取る）→「前もって取る」",
  },
  {
    word: "assess",
    pos: "動詞",
    meaning: "評価する・査定する",
    wrongChoices: ["承認する", "撤回する", "提出する"],
    example: "The team met to assess the risk of the new project.",
    exampleJa: "チームは新プロジェクトのリスクを評価するために集まった。",
    etymology: "ラテン語 assidere（ad- + sedere 座る）→「そばに座って判断する」",
  },
  {
    word: "authorize",
    pos: "動詞",
    meaning: "承認する・権限を与える",
    wrongChoices: ["禁止する", "調査する", "中断する"],
    example: "Only the CEO can authorize purchases over $10,000.",
    exampleJa: "1万ドルを超える購入を承認できるのはCEOだけだ。",
    etymology: "ラテン語 auctor（創始者・保証人）+ -ize →「権威ある立場から認める」",
  },
  {
    word: "collaboration",
    pos: "名詞",
    meaning: "協力・共同作業",
    wrongChoices: ["競合", "調査", "解雇"],
    example: "The project was completed through close collaboration between teams.",
    exampleJa: "そのプロジェクトはチーム間の緊密な協力によって完成した。",
    etymology: "ラテン語 collaborare（col- 共に + laborare 働く）→「共に働く」",
  },
  {
    word: "comply",
    pos: "動詞",
    meaning: "従う・遵守する",
    wrongChoices: ["拒否する", "提案する", "依頼する"],
    example: "All employees must comply with the company's safety regulations.",
    exampleJa: "全従業員は会社の安全規則を遵守しなければならない。",
    etymology: "ラテン語 complere（com- 完全に + plere 満たす）→「要求を満たす」",
  },
  {
    word: "consecutive",
    pos: "形容詞",
    meaning: "連続した・引き続く",
    wrongChoices: ["断続的な", "優先的な", "相互的な"],
    example: "The store has been open for five consecutive years.",
    exampleJa: "その店は5年連続で営業している。",
    etymology: "ラテン語 consequi（con- + sequi 続く）→「続けて起こる」",
  },
  {
    word: "consolidate",
    pos: "動詞",
    meaning: "統合する・強化する",
    wrongChoices: ["分割する", "延期する", "廃止する"],
    example: "The company decided to consolidate its two offices into one.",
    exampleJa: "会社は2つのオフィスを1つに統合することを決めた。",
    etymology: "ラテン語 consolidare（con- + solidare 固める）→「ひとつに固める」",
  },
  {
    word: "contract",
    pos: "名詞",
    meaning: "契約・契約書",
    wrongChoices: ["申請書", "報告書", "見積書"],
    example: "Please sign the contract before the end of the week.",
    exampleJa: "今週末までに契約書に署名してください。",
    etymology: "ラテン語 contrahere（con- 共に + trahere 引く）→「互いに引き合う約束」",
  },
  {
    word: "deadline",
    pos: "名詞",
    meaning: "締め切り・期限",
    wrongChoices: ["出発時刻", "目標値", "利益率"],
    example: "The report must be submitted before the Friday deadline.",
    exampleJa: "レポートは金曜日の締め切りまでに提出しなければならない。",
    etymology: "印刷業で「これを越えると印刷できない線」が原義。20世紀に転じて「期限」の意味に",
  },
  {
    word: "delegate",
    pos: "動詞",
    meaning: "委任する・権限を委ねる",
    wrongChoices: ["監視する", "交渉する", "訓練する"],
    example: "The manager delegated the task to her assistant.",
    exampleJa: "マネージャーはそのタスクをアシスタントに委任した。",
    etymology: "ラテン語 delegare（de- + legare 遣わす）→「代理として遣わす」",
  },
  {
    word: "durable",
    pos: "形容詞",
    meaning: "耐久性のある・長持ちする",
    wrongChoices: ["高価な", "軽量な", "精密な"],
    example: "This material is durable enough for outdoor use.",
    exampleJa: "この素材は屋外使用に十分な耐久性がある。",
    etymology: "ラテン語 durare（硬い・長続きする）→「長く続く」",
  },
  {
    word: "efficient",
    pos: "形容詞",
    meaning: "効率的な・能率のよい",
    wrongChoices: ["厳格な", "従来の", "手頃な"],
    example: "The new software makes the billing process more efficient.",
    exampleJa: "新しいソフトウェアにより請求プロセスがより効率的になった。",
    etymology: "ラテン語 efficere（ex- 外に + facere 作る）→「成果を作り出す」",
  },
  {
    word: "expire",
    pos: "動詞",
    meaning: "期限が切れる・満了する",
    wrongChoices: ["始まる", "延長される", "更新される"],
    example: "Your membership will expire at the end of this month.",
    exampleJa: "あなたの会員資格は今月末に満了します。",
    etymology: "ラテン語 expirare（ex- 外に + spirare 息をする）→「息が外に出る＝終わる」",
  },
  {
    word: "facilitate",
    pos: "動詞",
    meaning: "促進する・容易にする",
    wrongChoices: ["妨げる", "評価する", "記録する"],
    example: "The new bridge will facilitate the movement of goods.",
    exampleJa: "新しい橋は物資の輸送を促進するだろう。",
    etymology: "ラテン語 facilis（簡単な）→「簡単にする」",
  },
  {
    word: "implement",
    pos: "動詞",
    meaning: "実施する・実行に移す",
    wrongChoices: ["停止する", "分析する", "変更する"],
    example: "The company plans to implement the new policy next quarter.",
    exampleJa: "会社は次の四半期に新しい方針を実施する予定だ。",
    etymology: "ラテン語 implere（im- 中に + plere 満たす）→「完全に満たす＝実行する」",
  },
  {
    word: "initiative",
    pos: "名詞",
    meaning: "主導権・取り組み",
    wrongChoices: ["報告書", "予算案", "評価基準"],
    example: "The CEO launched a new initiative to reduce costs.",
    exampleJa: "CEOはコスト削減のための新しい取り組みを始めた。",
    etymology: "ラテン語 initium（始まり）→「最初に動き出す力」",
  },
  {
    word: "inventory",
    pos: "名詞",
    meaning: "在庫・棚卸し",
    wrongChoices: ["請求書", "仕様書", "議事録"],
    example: "We need to take inventory before placing a new order.",
    exampleJa: "新しい注文をする前に在庫を確認する必要がある。",
    etymology: "ラテン語 inventarium（発見されたものの一覧）→「持ち物のリスト」",
  },
  {
    word: "mandatory",
    pos: "形容詞",
    meaning: "義務的な・必須の",
    wrongChoices: ["任意の", "一時的な", "特別な"],
    example: "Attendance at the safety briefing is mandatory for all staff.",
    exampleJa: "安全説明会への出席は全スタッフに義務付けられている。",
    etymology: "ラテン語 mandatum（命令）→「命じられた＝義務的な」",
  },
  {
    word: "negotiate",
    pos: "動詞",
    meaning: "交渉する・折衝する",
    wrongChoices: ["承認する", "撤回する", "指示する"],
    example: "They spent two weeks negotiating the terms of the contract.",
    exampleJa: "彼らは契約条件の交渉に2週間費やした。",
    etymology: "ラテン語 negotiari（neg- 否定 + otium 余暇）→「余暇なく働く＝商売する」",
  },
  {
    word: "outstanding",
    pos: "形容詞",
    meaning: "未払いの・傑出した",
    wrongChoices: ["過払いの", "新規の", "一括払いの"],
    example: "There is still an outstanding balance on your account.",
    exampleJa: "あなたの口座にはまだ未払い残高があります。",
    etymology: "out（外に）+ standing（立っている）→「まだ外に出たまま＝未解決・際立っている」",
  },
  {
    word: "premises",
    pos: "名詞",
    meaning: "構内・敷地",
    wrongChoices: ["前提条件", "議事録", "仕様書"],
    example: "Smoking is not allowed on the company premises.",
    exampleJa: "会社の構内では喫煙は禁止されている。",
    etymology: "ラテン語 praemissa（前に置かれたもの）→「建物の説明書きから、その建物・敷地」",
  },
  {
    word: "renovate",
    pos: "動詞",
    meaning: "改装する・修繕する",
    wrongChoices: ["解体する", "建設する", "購入する"],
    example: "The hotel was renovated and reopened last spring.",
    exampleJa: "そのホテルは改装されて昨春に再オープンした。",
    etymology: "ラテン語 renovare（re- 再び + novare 新しくする）→「再び新しくする」",
  },
  {
    word: "submit",
    pos: "動詞",
    meaning: "提出する・提示する",
    wrongChoices: ["取り消す", "転送する", "承認する"],
    example: "Please submit your expense report by Friday.",
    exampleJa: "金曜日までに経費報告書を提出してください。",
    etymology: "ラテン語 submittere（sub- 下に + mittere 送る）→「下に送り出す＝提出する」",
  },
  {
    word: "surplus",
    pos: "名詞",
    meaning: "余剰・黒字・過剰",
    wrongChoices: ["不足", "損失", "需要"],
    example: "The company reported a budget surplus for the third consecutive year.",
    exampleJa: "会社は3年連続で予算余剰を報告した。",
    etymology: "フランス語 surplus（sur- 超えて + plus 多く）→「超過した分」",
  },
  {
    word: "verify",
    pos: "動詞",
    meaning: "確認する・証明する",
    wrongChoices: ["却下する", "修正する", "転送する"],
    example: "Please verify your email address to complete registration.",
    exampleJa: "登録を完了するためにメールアドレスを確認してください。",
    etymology: "ラテン語 verus（真実）+ facere（作る）→「真実であることを示す」",
  },
  {
    word: "warranty",
    pos: "名詞",
    meaning: "保証・品質保証書",
    wrongChoices: ["申請書", "取扱説明書", "領収書"],
    example: "The product comes with a two-year warranty.",
    exampleJa: "この製品には2年間の保証が付いている。",
    etymology: "古フランス語 warantir（保証する）→「品質を保証する文書」",
  },
  {
    word: "accommodate",
    pos: "動詞",
    meaning: "収容する・対応する",
    wrongChoices: ["拒否する", "解雇する", "延期する"],
    example: "The hotel can accommodate up to 300 guests.",
    exampleJa: "そのホテルは最大300名の宿泊客を収容できる。",
    etymology: "ラテン語 accommodare（ad- + commodus 便利な）→「都合に合わせる」",
  },
  {
    word: "agenda",
    pos: "名詞",
    meaning: "議題・予定表",
    wrongChoices: ["議事録", "契約書", "見積書"],
    example: "Please review the agenda before the meeting.",
    exampleJa: "会議の前に議題を確認してください。",
    etymology: "ラテン語 agenda（agere 行うべきことの複数形）→「やるべき事項のリスト」",
  },
  {
    word: "audit",
    pos: "名詞",
    meaning: "監査・会計検査",
    wrongChoices: ["採用活動", "研修プログラム", "業務報告"],
    example: "The company passed the annual financial audit.",
    exampleJa: "会社は年次財務監査を通過した。",
    etymology: "ラテン語 audire（聞く）→「会計報告を聞いて確認する」",
  },
  {
    word: "benchmark",
    pos: "名詞",
    meaning: "基準・指標",
    wrongChoices: ["予算超過", "損益計算書", "株主総会"],
    example: "The company uses industry averages as a benchmark.",
    exampleJa: "会社は業界平均を指標として使用している。",
    etymology: "測量用の「基準点マーク」が原義→「比較基準」に転用",
  },
  {
    word: "candidate",
    pos: "名詞",
    meaning: "候補者・志願者",
    wrongChoices: ["監督者", "株主", "仲裁者"],
    example: "We interviewed five candidates for the position.",
    exampleJa: "私たちはそのポジションに5名の候補者を面接した。",
    etymology: "ラテン語 candidatus（白い服を着た人）→ローマ時代の選挙立候補者の習慣から",
  },
  {
    word: "capacity",
    pos: "名詞",
    meaning: "収容能力・生産能力",
    wrongChoices: ["在庫数", "利益率", "損失額"],
    example: "The factory is running at full capacity.",
    exampleJa: "工場はフル稼働している。",
    etymology: "ラテン語 capere（受け取る・含む）→「受け容れられる量」",
  },
  {
    word: "clarify",
    pos: "動詞",
    meaning: "明確にする・説明する",
    wrongChoices: ["否定する", "省略する", "変更する"],
    example: "Could you clarify the terms of the agreement?",
    exampleJa: "契約の条件を明確にしていただけますか？",
    etymology: "ラテン語 clarus（明るい）+ facere（する）→「明るくする＝明確にする」",
  },
  {
    word: "compensate",
    pos: "動詞",
    meaning: "補償する・埋め合わせる",
    wrongChoices: ["懲罰を与える", "解雇する", "調査する"],
    example: "The company compensated employees for overtime work.",
    exampleJa: "会社は従業員に残業代を補償した。",
    etymology: "ラテン語 compensare（com- + pensare 重さを量る）→「重さで釣り合わせる」",
  },
  {
    word: "compromise",
    pos: "名詞",
    meaning: "妥協・折衷案",
    wrongChoices: ["対立", "却下", "強制"],
    example: "Both sides reached a compromise after long discussions.",
    exampleJa: "双方は長い議論の末に妥協案に達した。",
    etymology: "ラテン語 compromissum（相互の約束）→「互いに譲り合う」",
  },
  {
    word: "coordinate",
    pos: "動詞",
    meaning: "調整する・まとめる",
    wrongChoices: ["競合する", "妨害する", "撤退する"],
    example: "She coordinated the schedules of all departments.",
    exampleJa: "彼女はすべての部署のスケジュールを調整した。",
    etymology: "ラテン語 co-（共に）+ ordinare（順序立てる）→「共に整える」",
  },
  {
    word: "decline",
    pos: "動詞",
    meaning: "断る・減少する",
    wrongChoices: ["承諾する", "増加する", "延長する"],
    example: "Sales declined by 10% in the last quarter.",
    exampleJa: "売上は前四半期に10%減少した。",
    etymology: "ラテン語 declinare（de- 離れて + clinare 傾く）→「傾いて外れる」",
  },
  {
    word: "designate",
    pos: "動詞",
    meaning: "指定する・任命する",
    wrongChoices: ["辞退する", "解任する", "移転する"],
    example: "He was designated as the project leader.",
    exampleJa: "彼はプロジェクトリーダーに任命された。",
    etymology: "ラテン語 designare（de- + signare 印をつける）→「印をつけて選ぶ」",
  },
  {
    word: "determine",
    pos: "動詞",
    meaning: "決定する・判断する",
    wrongChoices: ["回避する", "延期する", "反論する"],
    example: "We need to determine the cause of the delay.",
    exampleJa: "遅延の原因を特定する必要がある。",
    etymology: "ラテン語 determinare（de- + terminare 境界を決める）→「限界を定める」",
  },
  {
    word: "distribute",
    pos: "動詞",
    meaning: "配布する・分配する",
    wrongChoices: ["回収する", "保管する", "廃棄する"],
    example: "The handouts were distributed to all participants.",
    exampleJa: "資料はすべての参加者に配布された。",
    etymology: "ラテン語 distribuere（dis- 分けて + tribuere 与える）→「分けて与える」",
  },
  {
    word: "eliminate",
    pos: "動詞",
    meaning: "排除する・取り除く",
    wrongChoices: ["追加する", "強化する", "保護する"],
    example: "The new process eliminates unnecessary steps.",
    exampleJa: "新しいプロセスは不要な工程を排除する。",
    etymology: "ラテン語 eliminare（e- 外へ + limen 敷居）→「敷居の外に出す」",
  },
  {
    word: "enhance",
    pos: "動詞",
    meaning: "向上させる・強化する",
    wrongChoices: ["損なう", "縮小する", "中断する"],
    example: "The upgrade enhances the system's performance.",
    exampleJa: "アップグレードによりシステムの性能が向上する。",
    etymology: "古フランス語 enhaucier（高める）→「価値・質を高める」",
  },
  {
    word: "ensure",
    pos: "動詞",
    meaning: "確保する・保証する",
    wrongChoices: ["否定する", "妨げる", "延期する"],
    example: "Please ensure that all documents are signed.",
    exampleJa: "すべての書類に署名されていることを確認してください。",
    etymology: "古フランス語 enseurer（en- + sûr 確かな）→「確実にする」",
  },
  {
    word: "establish",
    pos: "動詞",
    meaning: "設立する・確立する",
    wrongChoices: ["解散する", "移管する", "縮小する"],
    example: "The firm was established in 1985.",
    exampleJa: "その会社は1985年に設立された。",
    etymology: "ラテン語 stabilire（stabilis 安定した）→「しっかりと立てる」",
  },
  {
    word: "evaluate",
    pos: "動詞",
    meaning: "評価する・査定する",
    wrongChoices: ["無視する", "却下する", "記録する"],
    example: "Management will evaluate employee performance quarterly.",
    exampleJa: "経営陣は四半期ごとに従業員の業績を評価する。",
    etymology: "フランス語 évaluer（e- + valeur 価値）→「価値を測る」",
  },
  {
    word: "exceed",
    pos: "動詞",
    meaning: "超える・上回る",
    wrongChoices: ["下回る", "維持する", "達成する"],
    example: "Our sales exceeded the target by 20%.",
    exampleJa: "私たちの売上は目標を20%上回った。",
    etymology: "ラテン語 excedere（ex- 外に + cedere 行く）→「外へ出る＝超える」",
  },
  {
    word: "expand",
    pos: "動詞",
    meaning: "拡大する・展開する",
    wrongChoices: ["縮小する", "閉鎖する", "移転する"],
    example: "The company plans to expand its operations overseas.",
    exampleJa: "会社は海外への事業拡大を計画している。",
    etymology: "ラテン語 expandere（ex- + pandere 広げる）→「外へ広げる」",
  },
  {
    word: "flexible",
    pos: "形容詞",
    meaning: "柔軟な・融通のきく",
    wrongChoices: ["厳格な", "固定的な", "一方的な"],
    example: "We offer flexible working hours to our employees.",
    exampleJa: "私たちは従業員に柔軟な勤務時間を提供している。",
    etymology: "ラテン語 flectere（曲げる）→「曲げられる＝融通がきく」",
  },
  {
    word: "fluctuate",
    pos: "動詞",
    meaning: "変動する・上下する",
    wrongChoices: ["安定する", "急落する", "回復する"],
    example: "Currency exchange rates fluctuate daily.",
    exampleJa: "為替レートは毎日変動する。",
    etymology: "ラテン語 fluctuare（fluctus 波）→「波のように揺れる」",
  },
  {
    word: "forecast",
    pos: "名詞",
    meaning: "予測・見通し",
    wrongChoices: ["実績", "損失", "調査結果"],
    example: "The sales forecast for next year looks promising.",
    exampleJa: "来年の売上予測は有望に見える。",
    etymology: "fore-（前もって）+ cast（投げる）→「先を見越して投げる＝予測」",
  },
  {
    word: "generate",
    pos: "動詞",
    meaning: "生み出す・発生させる",
    wrongChoices: ["消費する", "削減する", "転換する"],
    example: "The new product line is expected to generate significant revenue.",
    exampleJa: "新製品ラインは大きな収益を生み出すと期待されている。",
    etymology: "ラテン語 generare（genus 種族）→「生み出す・産み出す」",
  },
  {
    word: "identify",
    pos: "動詞",
    meaning: "特定する・識別する",
    wrongChoices: ["無視する", "隠蔽する", "転送する"],
    example: "The team identified the main cause of the problem.",
    exampleJa: "チームは問題の主な原因を特定した。",
    etymology: "ラテン語 idem（同じ）+ facere（する）→「同一であると確認する」",
  },
  {
    word: "incentive",
    pos: "名詞",
    meaning: "奨励金・動機づけ",
    wrongChoices: ["罰則", "損失", "義務"],
    example: "The company offers bonuses as an incentive for performance.",
    exampleJa: "会社は業績へのインセンティブとしてボーナスを提供している。",
    etymology: "ラテン語 incentivus（incantare 調子を合わせる）→「やる気を引き出すもの」",
  },
  {
    word: "indicate",
    pos: "動詞",
    meaning: "示す・指摘する",
    wrongChoices: ["隠す", "否定する", "削除する"],
    example: "The data indicates a steady increase in demand.",
    exampleJa: "データは需要の着実な増加を示している。",
    etymology: "ラテン語 indicare（in- + dicare 宣言する）→「指し示す」",
  },
  {
    word: "inquire",
    pos: "動詞",
    meaning: "問い合わせる・尋ねる",
    wrongChoices: ["回答する", "拒否する", "転送する"],
    example: "Please inquire at the front desk for more information.",
    exampleJa: "詳細についてはフロントデスクにお問い合わせください。",
    etymology: "ラテン語 inquirere（in- + quaerere 求める）→「中へ求めて入る＝尋ねる」",
  },
  {
    word: "inspect",
    pos: "動詞",
    meaning: "検査する・点検する",
    wrongChoices: ["修理する", "承認する", "購入する"],
    example: "A safety officer will inspect the facility tomorrow.",
    exampleJa: "明日、安全担当者が施設を点検する。",
    etymology: "ラテン語 inspicere（in- 中を + specere 見る）→「中をよく見る」",
  },
  {
    word: "integrate",
    pos: "動詞",
    meaning: "統合する・組み込む",
    wrongChoices: ["分離する", "廃止する", "転換する"],
    example: "The new software integrates with existing systems.",
    exampleJa: "新しいソフトウェアは既存システムと統合される。",
    etymology: "ラテン語 integrare（integer 完全な）→「完全にする＝まとめる」",
  },
  {
    word: "investigate",
    pos: "動詞",
    meaning: "調査する・捜査する",
    wrongChoices: ["無視する", "隠蔽する", "承認する"],
    example: "Authorities are investigating the cause of the accident.",
    exampleJa: "当局は事故の原因を調査している。",
    etymology: "ラテン語 investigare（in- + vestigare 足跡をたどる）→「痕跡をたどる」",
  },
  {
    word: "launch",
    pos: "動詞",
    meaning: "開始する・発売する",
    wrongChoices: ["撤退する", "延期する", "回収する"],
    example: "The company will launch its new product next month.",
    exampleJa: "会社は来月、新製品を発売する。",
    etymology: "古フランス語 lanchier（槍を投げる）→「勢いよく始める」",
  },
  {
    word: "maintain",
    pos: "動詞",
    meaning: "維持する・保持する",
    wrongChoices: ["廃棄する", "変更する", "移転する"],
    example: "We need to maintain a high standard of service.",
    exampleJa: "高いサービス水準を維持する必要がある。",
    etymology: "ラテン語 manu tenere（手で持つ）→「手放さずに保つ」",
  },
  {
    word: "motivate",
    pos: "動詞",
    meaning: "動機を与える・やる気にさせる",
    wrongChoices: ["失望させる", "制限する", "解雇する"],
    example: "Good leaders know how to motivate their teams.",
    exampleJa: "優れたリーダーはチームのやる気を引き出す方法を知っている。",
    etymology: "ラテン語 movere（動かす）→「内側から動かす＝動機づける」",
  },
  {
    word: "notify",
    pos: "動詞",
    meaning: "通知する・知らせる",
    wrongChoices: ["無視する", "承認する", "取り消す"],
    example: "Please notify us of any changes to your schedule.",
    exampleJa: "スケジュールの変更があればお知らせください。",
    etymology: "ラテン語 notus（知られた）+ facere（する）→「知らせる」",
  },
  {
    word: "obtain",
    pos: "動詞",
    meaning: "入手する・獲得する",
    wrongChoices: ["失う", "返却する", "廃棄する"],
    example: "You need to obtain a permit before starting construction.",
    exampleJa: "建設を始める前に許可証を入手する必要がある。",
    etymology: "ラテン語 obtinere（ob- 向かって + tenere 保持する）→「手にして保持する」",
  },
  {
    word: "optimize",
    pos: "動詞",
    meaning: "最適化する",
    wrongChoices: ["悪化させる", "単純化する", "標準化する"],
    example: "We are working to optimize our supply chain.",
    exampleJa: "私たちはサプライチェーンの最適化に取り組んでいる。",
    etymology: "ラテン語 optimus（最善の）→「最善の状態にする」",
  },
  {
    word: "participate",
    pos: "動詞",
    meaning: "参加する",
    wrongChoices: ["欠席する", "辞退する", "妨害する"],
    example: "All employees are encouraged to participate in the survey.",
    exampleJa: "すべての従業員がアンケートへの参加を推奨されている。",
    etymology: "ラテン語 participare（pars 部分 + capere 取る）→「一部を受け取る＝参加する」",
  },
  {
    word: "postpone",
    pos: "動詞",
    meaning: "延期する",
    wrongChoices: ["中止する", "前倒しにする", "変更する"],
    example: "The meeting was postponed due to the typhoon.",
    exampleJa: "台風のため会議は延期された。",
    etymology: "ラテン語 postponere（post- 後に + ponere 置く）→「後回しにする」",
  },
  {
    word: "prohibit",
    pos: "動詞",
    meaning: "禁止する",
    wrongChoices: ["許可する", "奨励する", "推薦する"],
    example: "Smoking is prohibited in all indoor areas.",
    exampleJa: "すべての屋内エリアで喫煙は禁止されている。",
    etymology: "ラテン語 prohibere（pro- 前に + habere 持つ）→「前に立ちはだかって妨げる」",
  },
  {
    word: "promote",
    pos: "動詞",
    meaning: "促進する・昇進させる",
    wrongChoices: ["降格させる", "解雇する", "抑制する"],
    example: "She was promoted to senior manager last year.",
    exampleJa: "彼女は昨年シニアマネージャーに昇進した。",
    etymology: "ラテン語 promovere（pro- 前に + movere 動かす）→「前へ進ませる」",
  },
  {
    word: "propose",
    pos: "動詞",
    meaning: "提案する",
    wrongChoices: ["否決する", "取り下げる", "批判する"],
    example: "The team proposed a new marketing strategy.",
    exampleJa: "チームは新しいマーケティング戦略を提案した。",
    etymology: "ラテン語 proponere（pro- 前に + ponere 置く）→「前に提示する」",
  },
  {
    word: "recruit",
    pos: "動詞",
    meaning: "採用する・募集する",
    wrongChoices: ["解雇する", "降格させる", "研修する"],
    example: "The company is recruiting engineers with five years of experience.",
    exampleJa: "会社は5年の経験を持つエンジニアを採用している。",
    etymology: "フランス語 recruter（re- 再び + croître 成長する）→「新たに補充する」",
  },
  {
    word: "regulate",
    pos: "動詞",
    meaning: "規制する・管理する",
    wrongChoices: ["自由化する", "廃止する", "促進する"],
    example: "The government regulates the import of certain goods.",
    exampleJa: "政府は一部商品の輸入を規制している。",
    etymology: "ラテン語 regula（規則）→「規則に従わせる」",
  },
  {
    word: "reimburse",
    pos: "動詞",
    meaning: "払い戻す・弁済する",
    wrongChoices: ["請求する", "割り引く", "前払いする"],
    example: "The company will reimburse your travel expenses.",
    exampleJa: "会社が出張費を払い戻します。",
    etymology: "re-（再び）+ imburse（財布に入れる）→「財布に戻す＝払い戻す」",
  },
  {
    word: "resolve",
    pos: "動詞",
    meaning: "解決する",
    wrongChoices: ["悪化させる", "延期する", "回避する"],
    example: "We must resolve this issue before the deadline.",
    exampleJa: "締め切りまでにこの問題を解決しなければならない。",
    etymology: "ラテン語 resolvere（re- + solvere 解く）→「再びほどく＝解決する」",
  },
  {
    word: "restrict",
    pos: "動詞",
    meaning: "制限する・限定する",
    wrongChoices: ["拡大する", "開放する", "許可する"],
    example: "Access to the server room is restricted to authorized personnel.",
    exampleJa: "サーバールームへのアクセスは許可された職員に限定されている。",
    etymology: "ラテン語 restringere（re- + stringere 縛る）→「縛り戻す」",
  },
  {
    word: "retain",
    pos: "動詞",
    meaning: "保持する・確保する",
    wrongChoices: ["解雇する", "移転する", "廃棄する"],
    example: "The company has worked hard to retain experienced staff.",
    exampleJa: "会社は経験豊富なスタッフを確保するために努力してきた。",
    etymology: "ラテン語 retinere（re- + tenere 保持する）→「引き戻して保つ」",
  },
  {
    word: "revenue",
    pos: "名詞",
    meaning: "収益・売上",
    wrongChoices: ["費用", "損失", "負債"],
    example: "Annual revenue increased by 15% this year.",
    exampleJa: "今年の年間収益は15%増加した。",
    etymology: "フランス語 revenu（re- 戻る + venir 来る）→「戻ってくるお金」",
  },
  {
    word: "revise",
    pos: "動詞",
    meaning: "改訂する・修正する",
    wrongChoices: ["廃止する", "承認する", "提出する"],
    example: "The proposal was revised after the client's feedback.",
    exampleJa: "提案書はクライアントのフィードバックを受けて修正された。",
    etymology: "ラテン語 revisere（re- 再び + visere 見る）→「再び見直す」",
  },
  {
    word: "significant",
    pos: "形容詞",
    meaning: "重要な・著しい",
    wrongChoices: ["わずかな", "一時的な", "間接的な"],
    example: "There was a significant improvement in productivity.",
    exampleJa: "生産性に著しい改善が見られた。",
    etymology: "ラテン語 significare（signare 印をつける）→「意味を持つ＝重要な」",
  },
  {
    word: "specify",
    pos: "動詞",
    meaning: "明記する・指定する",
    wrongChoices: ["省略する", "曖昧にする", "取り消す"],
    example: "Please specify the delivery date in your order.",
    exampleJa: "注文書に配達日を明記してください。",
    etymology: "ラテン語 species（種類）+ facere（する）→「種類を明確にする」",
  },
  {
    word: "strategy",
    pos: "名詞",
    meaning: "戦略・方針",
    wrongChoices: ["日程表", "予算案", "議事録"],
    example: "The company's strategy focuses on expanding into new markets.",
    exampleJa: "会社の戦略は新市場への拡大に重点を置いている。",
    etymology: "ギリシャ語 strategos（将軍）→「将軍の計画・作戦」",
  },
  {
    word: "supervise",
    pos: "動詞",
    meaning: "監督する・管理する",
    wrongChoices: ["補助する", "採用する", "解雇する"],
    example: "She supervises a team of ten engineers.",
    exampleJa: "彼女は10名のエンジニアチームを監督している。",
    etymology: "ラテン語 supervidere（super- 上から + videre 見る）→「上から見張る」",
  },
  {
    word: "terminate",
    pos: "動詞",
    meaning: "終了する・解雇する",
    wrongChoices: ["開始する", "延長する", "更新する"],
    example: "The contract will be terminated at the end of the year.",
    exampleJa: "契約は年末に終了する。",
    etymology: "ラテン語 terminus（境界・終端）→「終わりにする」",
  },
  {
    word: "transfer",
    pos: "動詞",
    meaning: "転送する・異動させる",
    wrongChoices: ["削除する", "複製する", "保留する"],
    example: "He was transferred to the Tokyo branch.",
    exampleJa: "彼は東京支店に異動になった。",
    etymology: "ラテン語 transferre（trans- 向こうへ + ferre 運ぶ）→「向こうへ運ぶ」",
  },
  {
    word: "transition",
    pos: "名詞",
    meaning: "移行・転換",
    wrongChoices: ["停滞", "後退", "廃止"],
    example: "The transition to the new system went smoothly.",
    exampleJa: "新システムへの移行はスムーズに進んだ。",
    etymology: "ラテン語 transire（trans- 超えて + ire 行く）→「向こう側へ渡る」",
  },
  {
    word: "utilize",
    pos: "動詞",
    meaning: "活用する・利用する",
    wrongChoices: ["無駄にする", "廃棄する", "制限する"],
    example: "We should utilize all available resources efficiently.",
    exampleJa: "利用可能なすべてのリソースを効率的に活用すべきだ。",
    etymology: "ラテン語 utilis（有用な）→「役立たせる」",
  },
  {
    word: "validate",
    pos: "動詞",
    meaning: "検証する・有効にする",
    wrongChoices: ["無効にする", "否定する", "削除する"],
    example: "Please validate your parking ticket at the front desk.",
    exampleJa: "フロントデスクで駐車券を有効にしてください。",
    etymology: "ラテン語 validus（強い・有効な）→「有効であると確認する」",
  },
  {
    word: "objective",
    pos: "名詞",
    meaning: "目標・目的",
    wrongChoices: ["障害", "結果", "手段"],
    example: "Our main objective is to increase customer satisfaction.",
    exampleJa: "私たちの主な目標は顧客満足度を高めることだ。",
    etymology: "ラテン語 obiectum（前に置かれたもの）→「目の前に置かれた目標」",
  },
  {
    word: "productivity",
    pos: "名詞",
    meaning: "生産性",
    wrongChoices: ["収益性", "安全性", "柔軟性"],
    example: "Remote work has improved employee productivity.",
    exampleJa: "リモートワークにより従業員の生産性が向上した。",
    etymology: "ラテン語 producere（前に出す）→「産み出す力」",
  },
  {
    word: "potential",
    pos: "形容詞",
    meaning: "潜在的な・見込みのある",
    wrongChoices: ["現実的な", "否定的な", "過去の"],
    example: "This is a potential market we should explore.",
    exampleJa: "これは探索すべき潜在的な市場だ。",
    etymology: "ラテン語 potentia（力・能力）→「まだ発揮されていない力がある」",
  },
  {
    word: "procedure",
    pos: "名詞",
    meaning: "手順・手続き",
    wrongChoices: ["目標", "結果", "例外"],
    example: "Follow the standard procedure for submitting expense claims.",
    exampleJa: "経費申請の標準手続きに従ってください。",
    etymology: "ラテン語 procedere（pro- 前へ + cedere 進む）→「前へ進む順序」",
  },
  {
    word: "acknowledge",
    pos: "動詞",
    meaning: "認める・受領を知らせる",
    wrongChoices: ["否定する", "無視する", "隠す"],
    example: "Please acknowledge receipt of this email.",
    exampleJa: "このメールの受領をご確認ください。",
    etymology: "on + knowledge（知識）→「知っていることを認める」",
  },
  {
    word: "eligible",
    pos: "形容詞",
    meaning: "資格のある・対象となる",
    wrongChoices: ["禁止された", "任意の", "仮の"],
    example: "Employees with over two years of service are eligible for the bonus.",
    exampleJa: "2年以上勤続の従業員はボーナスの対象となる。",
    etymology: "ラテン語 eligere（選ぶ）→「選ばれるにふさわしい」",
  },
  {
    word: "confidential",
    pos: "形容詞",
    meaning: "機密の・秘密の",
    wrongChoices: ["公開の", "一般的な", "任意の"],
    example: "This document is strictly confidential.",
    exampleJa: "この文書は厳重に機密扱いである。",
    etymology: "ラテン語 confidere（信頼する）→「信頼して打ち明けられた」",
  },
  {
    word: "deficit",
    pos: "名詞",
    meaning: "赤字・不足額",
    wrongChoices: ["黒字", "収益", "余剰"],
    example: "The company reported a deficit for the first time in ten years.",
    exampleJa: "会社は10年ぶりに赤字を計上した。",
    etymology: "ラテン語 deficere（de- + facere 足りない）→「足りない分」",
  },
  {
    word: "substantial",
    pos: "形容詞",
    meaning: "相当な・かなりの",
    wrongChoices: ["わずかな", "一時的な", "平均的な"],
    example: "We made a substantial investment in new equipment.",
    exampleJa: "私たちは新しい設備に相当な投資をした。",
    etymology: "ラテン語 substantia（実体・中身）→「中身がある＝かなりの」",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function VocabQuizLoader({ message = "問題を生成中..." }: { message?: string }) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  function speak(text: string) {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
    if (voices[0]) utterance.voice = voices[0];
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  }

  const { entry, choices, correctIndex } = useMemo(() => {
    const entry = pickRandom(VOCAB_LIST);
    const rawChoices = shuffle([entry.meaning, ...entry.wrongChoices]);
    const correctIndex = rawChoices.indexOf(entry.meaning);
    return { entry, choices: rawChoices, correctIndex };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* ローディング表示 */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-500 text-sm">{message}</p>
          <p className="text-gray-400 text-xs">{elapsed}秒経過{elapsed >= 20 ? "　少々お待ちください…" : ""}</p>
        </div>

        {/* クイズカード */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              待ち時間で単語学習
            </span>
            <span className="text-xs text-gray-400">{entry.pos}</span>
          </div>

          <div className="mt-4 mb-6 flex items-center justify-center gap-3">
            <p className="text-3xl font-bold tracking-wide text-gray-900">
              {entry.word}
            </p>
            <button
              onClick={() => speak(entry.word)}
              disabled={playing}
              className="rounded-full p-2 text-blue-500 hover:bg-blue-50 disabled:opacity-40 transition-colors"
              title="発音を聞く"
            >
              {playing ? (
                <span className="text-sm animate-pulse">♪</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              )}
            </button>
          </div>

          <p className="mb-3 text-sm font-semibold text-gray-600">日本語の意味はどれ？</p>

          <div className="flex flex-col gap-2">
            {choices.map((choice, i) => {
              const isCorrect = i === correctIndex;
              const isSelected = selected === i;
              let bg = "border-gray-300 bg-white text-gray-800 hover:border-blue-400";
              if (answered && isCorrect) bg = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (answered && isSelected && !isCorrect) bg = "border-red-400 bg-red-50 text-red-700";
              else if (answered) bg = "border-gray-200 bg-gray-50 text-gray-400";
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`rounded-xl border-2 px-4 py-3 text-sm text-left transition-all ${bg} disabled:cursor-default`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-blue-700">例文</p>
                  <button
                    onClick={() => speak(entry.example)}
                    disabled={playing}
                    className="rounded-full p-0.5 text-blue-400 hover:bg-blue-100 disabled:opacity-40 transition-colors"
                    title="例文を聞く"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-800">{entry.example}</p>
                <p className="text-xs text-gray-500 mt-1">{entry.exampleJa}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-1">語源</p>
                <p className="text-sm text-gray-700">{entry.etymology}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
