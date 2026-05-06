"use client";

interface Props {
  label: "A" | "B" | "C" | "D";
  text: string;
  subText?: string;
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function ChoiceButton({
  label,
  text,
  subText,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
}: Props) {
  let className =
    "flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ";

  if (correct) {
    className += "border-green-500 bg-green-50";
  } else if (wrong && selected) {
    className += "border-red-500 bg-red-50";
  } else if (selected) {
    className += "border-blue-500 bg-blue-50";
  } else {
    className += "border-gray-200 bg-white hover:border-blue-400";
  }

  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
          correct
            ? "bg-green-500 text-white"
            : wrong && selected
            ? "bg-red-500 text-white"
            : selected
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {label}
      </span>
      {text && (
        <span className="flex flex-col">
          <span className="text-gray-900 font-medium">{text}</span>
          {subText && <span className="text-xs text-gray-500 mt-0.5">{subText}</span>}
        </span>
      )}
    </button>
  );
}
