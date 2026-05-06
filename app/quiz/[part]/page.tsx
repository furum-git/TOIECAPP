"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ToeicQuestion, UserAnswer, GenerateResponse } from "@/lib/types";
import QuizCard from "@/components/QuizCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function QuizPage() {
  const params = useParams<{ part: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const answersRef = useRef<UserAnswer[]>([]);

  // グループパート用: 現在のグループと、グループ内の表示問題番号
  const part = Number(params.part);
  const isGroupedPart = [3, 4, 6, 7].includes(part);
  // Part 3/4 は3問1組、Part 6/7 は全問が1組
  const groupSize = [3, 4].includes(part) ? 3 : questions.length;

  const [groupIndex, setGroupIndex] = useState(0);   // 何番目のグループか
  const [viewInGroup, setViewInGroup] = useState(0); // グループ内で表示中の問題 (0,1,2)

  useEffect(() => {
    const raw = sessionStorage.getItem("quizData");
    if (!raw) { router.replace("/"); return; }
    const data: GenerateResponse = JSON.parse(raw);
    setQuestions(data.questions);
  }, [router]);

  if (questions.length === 0) return <LoadingSpinner message="問題を読み込み中..." />;

  const groupStart = isGroupedPart ? groupIndex * groupSize : groupIndex;
  const currentIndex = isGroupedPart ? groupStart + viewInGroup : groupIndex;
  const current = questions[currentIndex];
  const groupQuestions = isGroupedPart ? questions.slice(groupStart, groupStart + groupSize) : undefined;
  const isLastGroup = !isGroupedPart || groupStart + groupSize >= questions.length;
  const isLastQuestion = !isGroupedPart && groupIndex + 1 >= questions.length;

  // グループ内の各問題の回答
  const groupAnswerMap = isGroupedPart && groupQuestions
    ? groupQuestions.map((q) => answers.find((a) => a.questionId === q.id) ?? null)
    : null;
  const allGroupAnswered = groupAnswerMap?.every((a) => a !== null) ?? false;

  function handleAnswer(answer: UserAnswer) {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== answer.questionId);
      const next = [...filtered, answer];
      answersRef.current = next;
      return next;
    });
  }

  function handleNext() {
    if (isGroupedPart) {
      if (isLastGroup) {
        sessionStorage.setItem("quizAnswers", JSON.stringify(answersRef.current));
        router.push("/result");
      } else {
        setGroupIndex((g) => g + 1);
        setViewInGroup(0);
      }
      return;
    }
    if (isLastQuestion) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(answersRef.current));
      router.push("/result");
      return;
    }
    setGroupIndex((g) => g + 1);
  }

  const preSelected = answers.find((a) => a.questionId === current?.id)?.selected ?? null;

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

        {/* Part 6: パッセージをタブの上に常時表示 */}
        {part === 6 && groupQuestions?.[0]?.passage && (
          <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed whitespace-pre-line border border-gray-200 text-gray-900">
            {groupQuestions[0].passage}
          </div>
        )}

        {/* グループパート用タブナビゲーション */}
        {isGroupedPart && groupQuestions && (
          <div className="mb-4 flex gap-2">
            {groupQuestions.map((q, i) => {
              const ans = answers.find((a) => a.questionId === q.id);
              const isActive = i === viewInGroup;
              return (
                <button
                  key={q.id}
                  onClick={() => setViewInGroup(i)}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all border-2 ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : ans
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-600"
                  }`}
                >
                  Q{i + 1}{ans ? " ✓" : ""}
                </button>
              );
            })}
          </div>
        )}

        <QuizCard
          question={current}
          questionNumber={currentIndex + 1}
          total={questions.length}
          showPassage={part !== 6 && ([7].includes(part) || viewInGroup === 0 || current.passage !== questions[currentIndex - 1]?.passage)}
          playAudio={!isGroupedPart || viewInGroup === 0}
          groupQuestions={groupQuestions}
          deferFeedback={isGroupedPart}
          preSelectedAnswer={preSelected}
          onAnswer={handleAnswer}
          onNext={handleNext}
          isLast={isGroupedPart ? false : isLastQuestion}
        />

        {/* グループ完了ボタン */}
        {isGroupedPart && (
          <button
            onClick={handleNext}
            disabled={!allGroupAnswered}
            className="mt-4 w-full rounded-xl py-3 font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLastGroup ? "結果を見る" : "次のグループへ"}
          </button>
        )}
      </div>
    </main>
  );
}
