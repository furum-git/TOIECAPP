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

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => {
          const answer = answers.find((a) => a.questionId === q.id);
          const isCorrect = answer?.selected === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`rounded-xl border-2 p-4 ${
                isCorrect ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${
                    isCorrect ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {isCorrect ? "正解" : "不正解"}
                </span>
                <span className="text-sm text-gray-500">問題 {i + 1}</span>
              </div>
              <p className="text-sm font-medium text-gray-800">{q.questionText}</p>
              {!isCorrect && (
                <p className="mt-1 text-sm text-red-600">
                  あなたの回答: {answer?.selected ?? "未回答"} →{" "}
                  <span className="font-semibold">正解: {q.correctAnswer}</span>
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600">{q.explanation}</p>
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
