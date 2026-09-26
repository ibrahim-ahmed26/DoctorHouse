import { NextResponse } from "next/server";

// Server-only: keeps GEMINI_API_KEY off the client entirely.
// Uses Gemini's Interactions API (the current standard, replacing generateContent
// for new API keys) with gemini-3.5-flash — free tier via Google AI Studio.
// Get a key at https://aistudio.google.com/apikey
const SYSTEM_PROMPT = `You are the friendly assistant for "Doctor House Care", a premium home
healthcare service. You help visitors understand the service: doctor and nurse home visits,
lab tests, imaging, medication delivery, equipment, and online consults — all coordinated by
one care team. You are NOT a doctor: never give medical advice, diagnoses, or treatment
recommendations. If asked something medical, gently redirect them to book a home visit so a
real doctor can help. If asked about booking, tell them to use the booking form on this page.
Keep answers short (2-4 sentences). Reply in the same language the visitor writes in
(English or Arabic).`;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Chat is not configured yet." }, { status: 503 });
  }

  // We resend the whole conversation every turn (store: false), so no
  // previous_interaction_id bookkeeping is needed — matches how the
  // widget already tracks history on the client.
  const input = messages.map((m) => ({
    type: m.role === "assistant" ? "model_output" : "user_input",
    content: [{ type: "text", text: m.content }],
  }));

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      model: "gemini-3.5-flash",
      store: false,
      system_instruction: SYSTEM_PROMPT,
      input,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini API error:", res.status, errText);
    return NextResponse.json({ error: "Chat request failed", detail: errText }, { status: 502 });
  }

  const data = await res.json();
  const lastStep = [...(data.steps ?? [])].reverse().find((s: any) => s.type === "model_output");
  const reply = lastStep?.content?.find((c: any) => c.type === "text")?.text ?? "";
  return NextResponse.json({ reply });
}
