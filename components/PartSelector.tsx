"use client";

import { ToeicPart } from "@/lib/types";

const PARTS: { part: ToeicPart; title: string; description: string }[] = [
  { part: 1, title: "Part 1", description: "写真描写問題" },
  { part: 2, title: "Part 2", description: "応答問題" },
  { part: 3, title: "Part 3", description: "会話問題" },
  { part: 4, title: "Part 4", description: "説明文問題" },
  { part: 5, title: "Part 5", description: "短文穴埋め" },
  { part: 6, title: "Part 6", description: "長文穴埋め" },
  { part: 7, title: "Part 7", description: "読解問題" },
];

interface Props {
  selectedPart: ToeicPart | null;
  onSelect: (part: ToeicPart) => void;
}

export default function PartSelector({ selectedPart, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PARTS.map(({ part, title, description }) => (
        <button
          key={part}
          onClick={() => onSelect(part)}
          className={`rounded-xl border-2 p-4 text-left transition-all hover:border-blue-500 hover:shadow-md ${
            selectedPart === part
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="font-bold text-blue-700">{title}</div>
          <div className="mt-1 text-sm text-gray-500">{description}</div>
        </button>
      ))}
    </div>
  );
}
