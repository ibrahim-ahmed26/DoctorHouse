import { NextResponse } from "next/server";

export const maxDuration = 30;

// Server-only: keeps GEMINI_API_KEY off the client entirely.
// Uses Gemini's Interactions API.
// Optional env vars:
//   GEMINI_MODEL           (default: gemini-3.5-flash)
//   GEMINI_FALLBACK_MODEL  (a second model to try if the first stays overloaded)
const SYSTEM_PROMPT = `You are the friendly assistant for "Doctor House Care", a premium home
healthcare service. You help visitors understand the service: doctor and nurse home visits,
lab tests, imaging, medication delivery, equipment, and online consults — all coordinated by
one care team. You are NOT a doctor: never give medical advice, diagnoses, or treatment
recommendations. If asked something medical, gently redirect them to book a home visit so a
real doctor can help. If asked about booking, tell them to use the booking form on this page.
Keep answers short (2-4 sentences). Reply in the same language the visitor writes in
(English or Arabic).`;

// Temporary Google-side problems worth retrying.
const RETRY_STATUS = [429, 500, 502, 503, 504];
const TRIES_PER_MODEL = 3;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Chat is not configured yet." },
      { status: 503 },
    );
  }

  // We resend the whole conversation every turn (store: false).
  const input = messages.map((m) => ({
    type: m.role === "assistant" ? "model_output" : "user_input",
    content: [{ type: "text", text: m.content }],
  }));

  const models = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash",
    process.env.GEMINI_FALLBACK_MODEL,
  ].filter((m, i, all): m is string => !!m && all.indexOf(m) === i);

  let lastStatus = 0;

  for (const model of models) {
    for (let attempt = 0; attempt < TRIES_PER_MODEL; attempt++) {
      if (attempt > 0) await sleep(500 * 2 ** (attempt - 1)); // 0.5s, 1s

      let res: Response;
      try {
        res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/interactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": key,
            },
            body: JSON.stringify({
              model,
              store: false,
              system_instruction: SYSTEM_PROMPT,
              input,
            }),
          },
        );
      } catch (err) {
        console.error("Gemini network error:", model, err);
        lastStatus = 503;
        continue;
      }

      if (res.ok) {
        const data = await res.json();
        const lastStep = [...(data.steps ?? [])]
          .reverse()
          .find((s: any) => s.type === "model_output");
        const reply =
          lastStep?.content?.find((c: any) => c.type === "text")?.text ?? "";
        return NextResponse.json({ reply });
      }

      lastStatus = res.status;
      console.error("Gemini API error:", model, res.status, await res.text());

      // Not temporary (bad key, bad request...): retrying won't help.
      if (!RETRY_STATUS.includes(res.status)) {
        return NextResponse.json(
          { error: "Chat request failed" },
          { status: 502 },
        );
      }
    }
  }

  // Still overloaded after every retry and fallback.
  return NextResponse.json(
    { busy: true, error: "busy", status: lastStatus },
    { status: 503 },
  );
}
