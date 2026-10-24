export type Bi = { en: string; ar: string };
export type Faq = { id: string; q: Bi; a: Bi; order: number };

const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Validates request bodies. Returns null if invalid. */
export function cleanFaq(body: any): Omit<Faq, "id"> | null {
  const q = { en: s(body?.q?.en, 300), ar: s(body?.q?.ar, 300) };
  const a = { en: s(body?.a?.en, 3000), ar: s(body?.a?.ar, 3000) };
  if (!q.en || !q.ar || !a.en || !a.ar) return null;
  const order = Number.isFinite(body?.order) ? Number(body.order) : 0;
  return { q, a, order };
}
