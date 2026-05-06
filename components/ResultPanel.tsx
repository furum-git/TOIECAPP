"use client";

import { ToeicQuestion, UserAnswer } from "@/lib/types";

interface Props {
  questions: ToeicQuestion[];
  answers: UserAnswer[];
  onRetry: () => void;
}

export default function ResultPanel({ questions, answers, onRetry }: Props) {
  const score = answers.filter(
    (a) => a.selected === questions.find((q) => q.id === a.questionId)?.correctAnswer
  ).length;

  return (
    <div>
      <div className="mb-8 rounded-2xl bg-blue-600 p-8 text-center text-white">
        <p className="text-lg font-semibold opacity-80">スコア</p>
        <p className="mt-2 text-6xl font-bold">
          {score} <span className="text-3xl">/ {questions.length}</span>
        </p>
        <p className="mt-2 text-lg opacity-80">
          正答率 {Math.round((score / questions.length) * 100)}%
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {questions.map((q, i) => {
          const answer = answers.find((a) => a.questionId === q.id);
          const isCorrect = answer?.selected === q.correctAnswer;
          const showPassage = q.passage && q.passage !== questions[i - 1]?.passage;

          return (
            <div key={q.id} className="flex flex-col gap-3">
              {showPassage && (
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    {[6, 7].includes(q.part) ? "問題文（英語）" : "スクリプト（英語）"}
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{q.passage}</p>
                  {q.passageJa && (
                    <>
                      <hr className="my-3 border-gray-200" />
                      <p className="text-xs font-semibold text-gray-500 mb-2">日本語訳</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{q.passageJa}</p>
                    </>
                  )}
                </div>
              )}
              <div className={`rounded-xl border-2 p-4 ${isCorrect ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}>
                <div className="mb-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                    {isCorrect ? "正解" : "不正解"}
                  </span>
                  <span className="text-sm text-gray-500">問題 {i + 1}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{q.questionText}</p>
                {q.questionTextJa && (
                  <p className="mt-1 text-xs text-gray-500 italic">{q.questionTextJa}</p>
                )}
                {!isCorrect && (
                  <p className="mt-1 text-sm text-red-600">
                    あなたの回答: {answer?.selected ?? "未回答"} →{" "}
                    <span className="font-semibold">正解: {q.correctAnswer}</span>
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600">{q.explanation}</p>
                <div className="mt-3 flex flex-col gap-1">
                  {(["A", "B", "C", "D"] as const).filter((k) => q.choices[k]).map((k) => {
                    const isRightChoice = k === q.correctAnswer;
                    const isWrongSelected = k === answer?.selected && !isRightChoice;
                    return (
                      <p key={k} className={`text-xs rounded px-1.5 py-0.5 ${
                        isRightChoice ? "bg-green-100 text-green-800 font-semibold" :
                        isWrongSelected ? "bg-red-100 text-red-700" :
                        "text-gray-500"
                      }`}>
                        <span className="font-semibold">{k}.</span> {q.choices[k]}
                        {isRightChoice && <span className="ml-1 text-green-600">✓ 正解</span>}
                        {q.choicesJa?.[k] && <span className={`ml-1 ${isRightChoice ? "text-green-600" : "text-gray-400"}`}>（{q.choicesJa[k]}）</span>}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRetry}
        className="mt-8 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        トップに戻る
      </button>
    </div>
  );
}
