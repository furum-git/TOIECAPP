"use client";

import { ToeicQuestion, UserAnswer } from "@/lib/types";

interface Props {
  questions: ToeicQuestion[];
  answers: UserAnswer[];
  onNext: () => void;
  isLast: boolean;
}

export default function GroupSummary({ questions, answers, onNext, isLast }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">グループ結果</h2>
      <div className="flex flex-col gap-6">
        {questions.map((q, i) => {
          const ans = answers.find((a) => a.questionId === q.id);
          const selected = ans?.selected ?? null;
          const isCorrect = selected === q.correctAnswer;
          return (
            <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Q{i + 1}. {q.questionText}
              </p>
              <div className="flex flex-col gap-1 mb-3">
                {(["A", "B", "C", "D"] as const).filter((k) => q.choices[k]).map((k) => {
                  const isAnswer = k === q.correctAnswer;
                  const isSelected = k === selected;
                  let style = "text-gray-700";
                  if (isAnswer) style = "text-green-700 font-bold";
                  else if (isSelected && !isAnswer) style = "text-red-600 line-through";
                  return (
                    <p key={k} className={`text-sm ${style}`}>
                      {k}. {q.choices[k]}
                      {isAnswer && " ✓"}
                      {isSelected && !isAnswer && " ✗"}
                      {q.choicesJa?.[k] && (
                        <span className="block text-xs font-normal text-gray-500 mt-0.5">{q.choicesJa[k]}</span>
                      )}
                    </p>
                  );
                })}
              </div>
              <div className="rounded-lg bg-white/70 border border-gray-200 p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">解説</p>
                <p className="text-xs text-gray-700 whitespace-pre-line">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onNext}
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        {isLast ? "結果を見る" : "次のグループへ"}
      </button>
    </div>
  );
}
