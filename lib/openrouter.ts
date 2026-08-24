import { CAPTURE_BOOKING_TOOL, REQUEST_HANDOFF_TOOL } from "@/lib/tools";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface OpenRouterResult {
  content: string | null;
  toolCalls: OpenRouterToolCall[];
  model: string;
}

function getModelChain(): string[] {
  const primary = process.env.OPENROUTER_MODEL_PRIMARY;
  const fallback = process.env.OPENROUTER_MODEL_FALLBACK;
  if (!primary) throw new Error("OPENROUTER_MODEL_PRIMARY is not set");
  return fallback ? [primary, fallback] : [primary];
}

// Free OpenRouter models rotate/get removed without notice — 429 (rate
// limited) and 404 (model no longer available) both mean "try the next
// model in the chain", same as a generic upstream 5xx.
function isRetryableStatus(status: number) {
  return status === 429 || status === 404 || status >= 500;
}

export async function callOpenRouter(messages: ChatMessage[]): Promise<OpenRouterResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const models = getModelChain();
  let lastError: unknown;

  for (const model of models) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          tools: [CAPTURE_BOOKING_TOOL, REQUEST_HANDOFF_TOOL],
        }),
      });

      if (!res.ok) {
        if (isRetryableStatus(res.status)) {
          lastError = new Error(`OpenRouter model ${model} responded ${res.status}`);
          continue;
        }
        throw new Error(`OpenRouter model ${model} responded ${res.status}`);
      }

      const data = await res.json();
      const choice = data.choices?.[0]?.message;
      return {
        content: choice?.content ?? null,
        toolCalls: choice?.tool_calls ?? [],
        model,
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All OpenRouter models failed");
}
