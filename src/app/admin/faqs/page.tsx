"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authFetch } from "@/lib/docs/client";
import { translations } from "@/lib/i18n/translations";
import type { Faq } from "@/lib/faqs";

const empty = { q: { en: "", ar: "" }, a: { en: "", ar: "" } };
const stripNum = (s: string) => s.replace(/^[٠-٩0-9]+\s*[.\-)]\s*/, "");

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [form, setForm] = useState<typeof empty>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const seeding = useRef(false);

  const importDefaults = useCallback(async (silent = false) => {
    const en = (translations as any).en.faq as string[][];
    const ar = (translations as any).ar.faq as string[][];
    const bulk = en.map((e, i) => ({
      q: { en: stripNum(e[0]), ar: stripNum(ar[i]?.[0] ?? e[0]) },
      a: { en: e[1], ar: ar[i]?.[1] ?? e[1] },
    }));
    const id = silent ? undefined : toast.loading("Importing…");
    const res = await authFetch("/api/admin/faqs", {
      method: "POST",
      body: JSON.stringify({ bulk }),
    });
    if (res.ok) {
      toast.success(
        silent ? "Loaded your current FAQs" : "Imported",
        id ? { id } : undefined,
      );
      return true;
    }
    toast.error("Import failed", id ? { id } : undefined);
    return false;
  }, []);

  const load = useCallback(async () => {
    const res = await authFetch("/api/admin/faqs");
    if (!res.ok) return setLoading(false);
    const data = await res.json();
    // First visit ever: copy the built-in FAQs into the database automatically.
    if (!data.seeded && data.faqs.length === 0 && !seeding.current) {
      seeding.current = true;
      if (await importDefaults(true)) return load();
    }
    setFaqs(data.faqs);
    setLoading(false);
  }, [importDefaults]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    const id = toast.loading("Saving…");
    const res = await authFetch(
      editing ? `/api/admin/faqs/${editing}` : "/api/admin/faqs",
      {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          ...form,
          order: editing
            ? faqs.find((f) => f.id === editing)?.order
            : undefined,
        }),
      },
    );
    if (res.ok) {
      toast.success("Saved", { id });
      setForm(empty);
      setEditing(null);
      load();
    } else
      toast.error((await res.json().catch(() => ({}))).error || "Failed", {
        id,
      });
  };

  const remove = async (f: Faq) => {
    if (!confirm("Delete this FAQ?")) return;
    const res = await authFetch(`/api/admin/faqs/${f.id}`, {
      method: "DELETE",
    });
    res.ok ? (toast.success("Deleted"), load()) : toast.error("Failed");
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= faqs.length) return;
    const a = faqs[i],
      b = faqs[j];
    await Promise.all([
      authFetch(`/api/admin/faqs/${a.id}`, {
        method: "PUT",
        body: JSON.stringify({ q: a.q, a: a.a, order: j }),
      }),
      authFetch(`/api/admin/faqs/${b.id}`, {
        method: "PUT",
        body: JSON.stringify({ q: b.q, a: b.a, order: i }),
      }),
    ]);
    load();
  };

  const set = (k: "q" | "a", l: "en" | "ar", v: string) =>
    setForm({ ...form, [k]: { ...form[k], [l]: v } });

  return (
    <div className="adm-page">
      <div className="adm-head">
        <h1 className="adm-title">FAQs</h1>
        <span className="adm-count">{faqs.length} questions</span>
      </div>

      <div className="adm-card adm-form">
        <h2 className="adm-sub">{editing ? "Edit FAQ" : "Add a new FAQ"}</h2>
        <div className="adm-grid2">
          <input
            className="adm-input"
            placeholder="Question (English)"
            value={form.q.en}
            onChange={(e) => set("q", "en", e.target.value)}
          />
          <input
            className="adm-input"
            dir="rtl"
            placeholder="السؤال (عربي)"
            value={form.q.ar}
            onChange={(e) => set("q", "ar", e.target.value)}
          />
          <textarea
            className="adm-input"
            rows={4}
            placeholder="Answer (English)"
            value={form.a.en}
            onChange={(e) => set("a", "en", e.target.value)}
          />
          <textarea
            className="adm-input"
            rows={4}
            dir="rtl"
            placeholder="الإجابة (عربي)"
            value={form.a.ar}
            onChange={(e) => set("a", "ar", e.target.value)}
          />
        </div>
        <div className="adm-actions">
          <button className="adm-btn adm-btn-primary" onClick={save}>
            {editing ? "Update FAQ" : "+ Add FAQ"}
          </button>
          {editing && (
            <button
              className="adm-btn"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {loading && <p className="adm-muted">Loading…</p>}
      {!loading && faqs.length === 0 && (
        <p className="adm-muted">
          No FAQs yet.{" "}
          <button
            className="adm-btn"
            onClick={() => importDefaults().then(load)}
          >
            Import built-in FAQs
          </button>
        </p>
      )}

      <div className="adm-list">
        {faqs.map((f, i) => (
          <div key={f.id} className="adm-card adm-row">
            <span className="adm-num">{i + 1}</span>
            <div className="adm-row-main">
              <strong>{f.q.en}</strong>
              <div className="adm-muted" dir="rtl">
                {f.q.ar}
              </div>
            </div>
            <div className="adm-row-actions">
              <button
                className="adm-btn adm-icon"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                className="adm-btn adm-icon"
                onClick={() => move(i, 1)}
                disabled={i === faqs.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                className="adm-btn"
                onClick={() => {
                  setEditing(f.id);
                  setForm({ q: f.q, a: f.a });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit
              </button>
              <button
                className="adm-btn adm-btn-danger"
                onClick={() => remove(f)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
