"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ToeicQuestion, UserAnswer, GenerateResponse } from "@/lib/types";
import QuizCard from "@/components/QuizCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function QuizPage() {
  const params = useParams<{ part: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("quizData");
    if (!raw) {
      router.replace("/");
      return;
    }
    const data: GenerateResponse = JSON.parse(raw);
    setQuestions(data.questions);
  }, [router]);

  if (questions.length === 0) return <LoadingSpinner message="問題を読み込み中..." />;

  const current = questions[currentIndex];
  const isFirst = currentIndex === 0;

  function handleAnswer(answer: UserAnswer) {
    setAnswers((prev) => [...prev, answer]);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
      router.push("/result");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← トップに戻る
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Part {params.part}
          </span>
        </div>

        <QuizCard
          question={current}
          questionNumber={currentIndex + 1}
          total={questions.length}
          showPassage={isFirst || current.passage !== questions[currentIndex - 1]?.passage}
          onAnswer={handleAnswer}
          onNext={handleNext}
          isLast={currentIndex + 1 >= questions.length}
        />
      </div>
    </main>
  );
}
