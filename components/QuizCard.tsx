"use client";

import { useState } from "react";
import { ToeicQuestion, UserAnswer } from "@/lib/types";
import ChoiceButton from "./ChoiceButton";

interface Props {
  question: ToeicQuestion;
  questionNumber: number;
  total: number;
  showPassage: boolean;
  onAnswer: (answer: UserAnswer) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function QuizCard({
  question,
  questionNumber,
  total,
  showPassage,
  onAnswer,
  onNext,
  isLast,
}: Props) {
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [answered, setAnswered] = useState(false);

  const choices = (["A", "B", "C", "D"] as const).filter(
    (k) => question.choices[k] !== ""
  );

  function handleSelect(choice: "A" | "B" | "C" | "D") {
    if (answered) return;
    setSelected(choice);
    setAnswered(true);
    onAnswer({ questionId: question.id, selected: choice });
  }

  function handleNext() {
    setSelected(null);
    setAnswered(false);
    onNext();
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          Part {question.part}
        </span>
        <span className="text-sm text-gray-500">
          {questionNumber} / {total}
        </span>
      </div>

      {question.scenario && (
        <p className="mb-3 rounded-lg bg-yellow-50 p-3 text-sm text-gray-700 border border-yellow-200">
          <span className="font-semibold">状況: </span>
          {question.scenario}
        </p>
      )}

      {showPassage && question.passage && (
        <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed whitespace-pre-line border border-gray-200">
          {question.passage}
        </div>
      )}

      <p className="mb-5 text-base font-medium text-gray-800">
        {question.questionText}
      </p>

      <div className="flex flex-col gap-2">
        {choices.map((key) => (
          <ChoiceButton
            key={key}
            label={key}
            text={question.choices[key]}
            selected={selected === key}
            correct={answered && key === question.correctAnswer}
            wrong={answered && selected === key && key !== question.correctAnswer}
            disabled={answered}
            onClick={() => handleSelect(key)}
          />
        ))}
      </div>

      {answered && (
        <div className="mt-5">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <p className="text-sm font-semibold text-blue-700 mb-1">解説</p>
            <p className="text-sm text-gray-700">{question.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {isLast ? "結果を見る" : "次の問題"}
          </button>
        </div>
      )}
    </div>
  );
}
