"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ToeicQuestion, UserAnswer } from "@/lib/types";
import ChoiceButton from "./ChoiceButton";
import AudioPlayer, { AudioSegment } from "./AudioPlayer";

const LISTENING_PARTS = [1, 2, 3, 4];

function removeJapanese(text: string): string {
  return text.replace(/[\u3000-\u9FFF\uF900-\uFAFF]/g, "").trim();
}

function parsePassageSegments(passage: string): AudioSegment[] {
  return passage.split("\n").flatMap((line) => {
    const match = line.match(/^(Man|Woman|Narrator|Speaker\s*\w*):\s*(.+)/i);
    if (!match) return [];
    const speaker = /woman/i.test(match[1]) ? "female" : /narrator/i.test(match[1]) ? "neutral" : "male";
    const text = removeJapanese(match[2]);
    return text ? [{ speaker, text }] : [];
  });
}

function getListeningText(question: ToeicQuestion): string {
  if (question.part === 1) {
    const { A, B, C, D } = question.choices;
    return `A. ${A}  B. ${B}  C. ${C}  D. ${D}`;
  }
  if (question.part === 2) {
    const { A, B, C } = question.choices;
    return `${question.questionText}  A. ${A}  B. ${B}  C. ${C}`;
  }
  return removeJapanese(question.passage ?? question.questionText);
}

// playKey が変わるたびにリマウントして autoPlay=true で確実に再生
function AudioPlayerMemo({ question, playKey, autoPlay, delayMs }: { question: ToeicQuestion; playKey: number; autoPlay: boolean; delayMs?: number }) {
  const segments = useMemo(
    () => [3, 4].includes(question.part) && question.passage ? parsePassageSegments(question.passage) : null,
    [question.id, question.passage] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const hasSegments = segments !== null && segments.length > 0;
  return (
    <AudioPlayer
      key={playKey}
      segments={hasSegments ? segments! : undefined}
      text={hasSegments ? undefined : getListeningText(question)}
      autoPlay={autoPlay}
      delayMs={delayMs}
    />
  );
}

interface Props {
  question: ToeicQuestion;
  questionNumber: number;
  total: number;
  showPassage: boolean;
  playAudio?: boolean;
  groupQuestions?: ToeicQuestion[];
  deferFeedback?: boolean;
  preSelectedAnswer?: "A" | "B" | "C" | "D" | null;
  onAnswer: (answer: UserAnswer) => void;
  onNext: () => void;
  isLast: boolean;
}

const READING_TIME = 15;

export default function QuizCard({
  question,
  questionNumber,
  total,
  showPassage,
  playAudio = true,
  groupQuestions,
  deferFeedback = false,
  preSelectedAnswer = null,
  onAnswer,
  onNext,
  isLast,
}: Props) {
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(preSelectedAnswer);
  const [answered, setAnswered] = useState(preSelectedAnswer !== null);
  const needsCountdown = [3, 4].includes(question.part) && playAudio;
  const [countdown, setCountdown] = useState(needsCountdown ? READING_TIME : 0);
  const [playKey, setPlayKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSelected(preSelectedAnswer ?? null);
    setAnswered(preSelectedAnswer !== null);
    // すでにカウントダウン済み（playKey>0）なら再起動しない
    if (!needsCountdown || playKey > 0) return;
    setCountdown(READING_TIME);
    timerRef.current = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(timerRef.current!);
          setPlayKey((k) => k + 1);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [question.id, needsCountdown]); // eslint-disable-line react-hooks/exhaustive-deps

  const choices = (["A", "B", "C", "D"] as const).filter(
    (k) => question.choices[k] !== ""
  );

  function handleSelect(choice: "A" | "B" | "C" | "D") {
    setSelected(choice);
    setAnswered(true);
    onAnswer({ questionId: question.id, selected: choice });
    // deferFeedback時は自動進行しない（QuizPage側のタブで自由に移動）
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

      {LISTENING_PARTS.includes(question.part) && (playAudio || !!groupQuestions) && (
        <AudioPlayerMemo
          key={[1, 2].includes(question.part) ? question.id : playKey}
          question={question}
          playKey={playKey}
          autoPlay={needsCountdown ? playKey > 0 : playAudio}
          delayMs={[1, 2].includes(question.part) ? 1000 : 400}
        />
      )}

      {question.part === 1 && question.imageUrl && (
        <div className="mb-4">
          <img
            src={question.imageUrl}
            alt="TOEIC Part 1 photo"
            className="w-full rounded-xl object-cover"
            style={{ maxHeight: 320 }}
          />
        </div>
      )}

      {question.scenario && question.part !== 1 && (
        <p className="mb-3 rounded-lg bg-yellow-50 p-3 text-sm text-gray-700 border border-yellow-200">
          <span className="font-semibold">状況: </span>
          {question.scenario}
        </p>
      )}

      {showPassage && question.passage && ![3, 4].includes(question.part) && (
        <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed whitespace-pre-line border border-gray-200 text-gray-900">
          {question.passage}
        </div>
      )}

      {countdown > 0 && groupQuestions ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
            <span className="text-yellow-700 text-sm font-semibold">問題を読んでください</span>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-yellow-600">{countdown}秒</span>
              <button
                onClick={() => { clearInterval(timerRef.current!); setCountdown(0); setPlayKey((k) => k + 1); }}
                className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-600 transition-colors"
              >
                回答へ進む
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {groupQuestions.map((q, i) => (
              <div key={q.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Q{i + 1}. {q.questionText}
                </p>
                <ol className="flex flex-col gap-1">
                  {(["A", "B", "C", "D"] as const).filter((k) => q.choices[k]).map((k) => (
                    <li key={k} className="text-sm text-gray-700">
                      <span className="font-semibold mr-1">{k}.</span>{q.choices[k]}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      ) : question.part === 2 && !answered ? (
        <p className="mb-5 text-base font-medium text-gray-800">
          Listen to the audio and choose the most appropriate response.
        </p>
      ) : (
        <p className="mb-5 text-base font-medium text-gray-800">
          {question.questionText}
        </p>
      )}

      {countdown === 0 && (
        <div className="flex flex-col gap-2">
          {choices.map((key) => (
            <ChoiceButton
              key={key}
              label={key}
              text={[1, 2].includes(question.part) && !answered ? "" : question.choices[key]}
              subText={answered && !deferFeedback ? question.choicesJa?.[key] : undefined}
              selected={selected === key}
              correct={!deferFeedback && answered && key === question.correctAnswer}
              wrong={!deferFeedback && answered && selected === key && key !== question.correctAnswer}
              disabled={!deferFeedback && answered}
              onClick={() => handleSelect(key)}
            />
          ))}
        </div>
      )}

      {!deferFeedback && answered && (
        <div className="mt-5">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <p className="text-sm font-semibold text-blue-700 mb-2">解説</p>
            {question.explanationPerChoice ? (
              <div className="flex flex-col gap-2">
                {(["A", "B", "C", "D"] as const)
                  .filter((k) => question.choices[k] !== "")
                  .map((k) => (
                    <div
                      key={k}
                      className={`flex gap-2 rounded-md px-3 py-2 text-sm ${
                        k === question.correctAnswer
                          ? "bg-green-100 text-green-800"
                          : k === selected
                          ? "bg-red-100 text-red-800"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <span className="font-bold shrink-0">{k}.</span>
                      <span>{question.explanationPerChoice![k]}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-line">{question.explanation}</p>
            )}
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
