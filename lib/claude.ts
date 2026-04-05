import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-opus-4-6";
export const MAX_TOKENS = 4096;

export function extractJson(text: string): string {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}
