export type ToeicPart = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ToeicQuestion {
  id: string;
  part: ToeicPart;
  passage?: string;
  scenario?: string;
  imageUrl?: string;
  questionText: string;
  choices: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface GenerateRequest {
  part: ToeicPart;
  count: number;
  docType?: "single" | "double" | "triple";
}

export interface GenerateResponse {
  questions: ToeicQuestion[];
}

export interface UserAnswer {
  questionId: string;
  selected: "A" | "B" | "C" | "D" | null;
}
