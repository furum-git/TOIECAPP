"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToeicQuestion, UserAnswer, GenerateResponse } from "@/lib/types";
import ResultPanel from "@/components/ResultPanel";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ResultPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  useEffect(() => {
    const rawData = sessionStorage.getItem("quizData");
    const rawAnswers = sessionStorage.getItem("quizAnswers");
    if (!rawData || !rawAnswers) {
      router.replace("/");
      return;
    }
    const data: GenerateResponse = JSON.parse(rawData);
    setQuestions(data.questions);
    setAnswers(JSON.parse(rawAnswers));
  }, [router]);

  if (questions.length === 0) return <LoadingSpinner message="結果を集計中..." />;

  function handleRetry() {
    sessionStorage.removeItem("quizData");
    sessionStorage.removeItem("quizAnswers");
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          結果
        </h1>
        <ResultPanel questions={questions} answers={answers} onRetry={handleRetry} />
      </div>
    </main>
  );
}
