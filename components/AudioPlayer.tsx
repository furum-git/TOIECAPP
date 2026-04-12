"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ text, autoPlay = true }: Props) {
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  function speak() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    // 英語の声を選ぶ
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }

  useEffect(() => {
    if (!autoPlay) return;
    // 音声リスト読み込み待ち
    const tryPlay = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        speak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => speak();
      }
    };
    const timer = setTimeout(tryPlay, 300);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
      <span className="text-blue-700 text-sm font-semibold">🔊 リスニング</span>
      <button
        onClick={playing ? stop : speak}
        className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
          playing
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {playing ? "■ 停止" : "▶ 再生"}
      </button>
      {playing && (
        <span className="text-xs text-blue-500 animate-pulse">再生中...</span>
      )}
    </div>
  );
}
