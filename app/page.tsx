"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PartSelector from "@/components/PartSelector";
import VocabQuizLoader from "@/components/VocabQuizLoader";
import { ToeicPart } from "@/lib/types";

const COUNT_OPTIONS = [3, 5, 10];

export default function Home() {
  const router = useRouter();
  const [selectedPart, setSelectedPart] = useState<ToeicPart | null>(null);
  const [count, setCount] = useState(5);
  const [docType, setDocType] = useState<"single" | "double" | "triple">("single");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    if (!selectedPart) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        part: selectedPart,
        count: [6, 7].includes(selectedPart) ? undefined : [3, 4].includes(selectedPart) ? 3 : count,
        docType: selectedPart === 7 ? docType : undefined,
      }),
    });

    if (!res.ok) {
      setError("問題の生成に失敗しました。もう一度お試しください。");
      setLoading(false);
      return;
    }

    const data = await res.json();
    sessionStorage.setItem("quizData", JSON.stringify(data));
    router.push(`/quiz/${selectedPart}`);
  }

  if (loading) return <VocabQuizLoader />;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          TOEIC 問題生成
        </h1>
        <p className="mb-8 text-center text-gray-500">
          AIが本番レベルのTOEIC問題を生成します
        </p>

        <section className="mb-6">
          <h2 className="mb-3 font-semibold text-gray-700">パートを選択</h2>
          <PartSelector selectedPart={selectedPart} onSelect={setSelectedPart} />
        </section>

        {selectedPart && ![3, 4, 6, 7].includes(selectedPart) && (
          <section className="mb-6">
            <h2 className="mb-3 font-semibold text-gray-700">問題数</h2>
            <div className="flex gap-3">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`rounded-lg border-2 px-5 py-2 font-semibold transition-all ${
                    count === n
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                  }`}
                >
                  {n}問
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedPart === 7 && (
          <section className="mb-6">
            <h2 className="mb-3 font-semibold text-gray-700">文書タイプ</h2>
            <div className="flex gap-3">
              {(["single", "double", "triple"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setDocType(t)}
                  className={`rounded-lg border-2 px-4 py-2 font-semibold transition-all ${
                    docType === t
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                  }`}
                >
                  {t === "single" ? "1文書" : t === "double" ? "2文書" : "3文書"}
                </button>
              ))}
            </div>
          </section>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </p>
        )}

        <button
          onClick={handleStart}
          disabled={!selectedPart}
          className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          問題を生成する
        </button>
      </div>
    </main>
  );
}
