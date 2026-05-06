"use client";

import { useEffect, useRef, useState } from "react";

export interface AudioSegment {
  speaker: "male" | "female" | "neutral";
  text: string;
}

interface Props {
  text?: string;
  segments?: AudioSegment[];
  autoPlay?: boolean;
  delayMs?: number;
}

function getVoices(): { male: SpeechSynthesisVoice | null; female: SpeechSynthesisVoice | null; neutral: SpeechSynthesisVoice | null } {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
  const femaleKeywords = /female|zira|susan|samantha|karen|victoria|fiona|moira|tessa|allison|ava|kate/i;
  const maleKeywords = /male|david|mark|richard|james|guy|daniel|alex|fred/i;
  const female = voices.find((v) => femaleKeywords.test(v.name)) ?? voices[1] ?? null;
  const male = voices.find((v) => maleKeywords.test(v.name)) ?? voices[0] ?? null;
  const neutral = voices[0] ?? null;
  return { male: male !== female ? male : voices[2] ?? male, female, neutral };
}

export default function AudioPlayer({ text, segments, autoPlay = false, delayMs = 400 }: Props) {
  const [playing, setPlaying] = useState(false);
  const cancelledRef = useRef(false);

  // speak は毎レンダーで最新値を持つ。ref 経由で useEffect から参照する
  const speakRef = useRef<() => void>(() => {});

  function speakSegments(segs: AudioSegment[]) {
    window.speechSynthesis.cancel();
    cancelledRef.current = false;
    const { male, female, neutral } = getVoices();
    const queue = [...segs];
    let index = 0;
    function next() {
      if (cancelledRef.current || index >= queue.length) { setPlaying(false); return; }
      const seg = queue[index++];
      const utterance = new SpeechSynthesisUtterance(seg.text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      const voice = seg.speaker === "female" ? (female ?? neutral) : seg.speaker === "neutral" ? neutral : (male ?? neutral);
      if (voice) utterance.voice = voice;
      utterance.onend = next;
      utterance.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
    setPlaying(true);
    next();
  }

  function speakText(t: string) {
    window.speechSynthesis.cancel();
    cancelledRef.current = false;
    const utterance = new SpeechSynthesisUtterance(t);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    const { neutral } = getVoices();
    if (neutral) utterance.voice = neutral;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }

  function speak() {
    const hasSegments = segments && segments.length > 0;
    if (hasSegments) speakSegments(segments!);
    else if (text) speakText(text);
  }

  // speak の参照を常に最新に保つ
  useEffect(() => { speakRef.current = speak; });

  function stop() {
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setPlaying(false);
  }

  // マウント時に autoPlay=true なら再生（key prop でリマウントして使う）
  useEffect(() => {
    if (!autoPlay) return;
    const tryPlay = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) speakRef.current();
      else window.speechSynthesis.onvoiceschanged = () => speakRef.current();
    };
    const timer = setTimeout(tryPlay, delayMs);
    return () => { clearTimeout(timer); cancelledRef.current = true; window.speechSynthesis.cancel(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
      <span className="text-blue-700 text-sm font-semibold">🔊 リスニング</span>
      <button
        onClick={playing ? stop : () => speakRef.current()}
        className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
          playing
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {playing ? "■ 停止" : "▶ 再生"}
      </button>
      {playing && <span className="text-xs text-blue-500 animate-pulse">再生中...</span>}
    </div>
  );
}
