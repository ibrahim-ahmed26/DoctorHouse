"use client";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth/authFetch";

type Doc = { id: string; title: { en: string; ar: string }; order: number };

export default function DocumentsAdminPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await authFetch("/api/admin/documents");
    const data = await res.json();
    setDocs(data.docs ?? []);
    setHasPassword(!!data.hasPassword);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    const form = new FormData();
    form.append("file", file);
    form.append("titleEn", titleEn);
    form.append("titleAr", titleAr);
    form.append("order", String(docs.length + 1));

    const res = await authFetch("/api/admin/documents", {
      method: "POST",
      body: form as any,
    });
    const data = await res.json();
    if (!res.ok) {
      setUploadError(data.error ?? "Upload failed");
      setUploading(false);
      return;
    }
    setTitleEn("");
    setTitleAr("");
    setFile(null);
    setUploading(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this document?")) return;
    await authFetch(`/api/admin/documents/${id}`, { method: "DELETE" });
    await load();
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPw(true);
    setPwMsg(null);
    const res = await authFetch("/api/admin/documents", {
      method: "PUT",
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPwMsg(data.error ?? "Failed to set password");
    } else {
      setPwMsg("Password saved.");
      setPassword("");
      setHasPassword(true);
    }
    setSavingPw(false);
  }

  return (
    <div>
      <div className="admin-header-row">
        <h1>Documents (max 3)</h1>
      </div>

      <form
        onSubmit={savePassword}
        className="admin-form"
        style={{ marginBottom: 24 }}
      >
        <h2>Viewer password</h2>
        <p style={{ fontSize: 13, color: "var(--mute)" }}>
          Status:{" "}
          {hasPassword
            ? "A password is set."
            : "No password set yet — documents can't be unlocked until you set one."}
        </p>
        <div className="admin-field">
          <label>New password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={4}
          />
        </div>
        {pwMsg && (
          <p
            style={{
              fontSize: 13,
              color: pwMsg.includes("saved") ? "green" : "#d33",
            }}
          >
            {pwMsg}
          </p>
        )}
        <div className="admin-form-actions">
          <button className="admin-btn" disabled={savingPw}>
            {savingPw ? "Saving..." : "Save password"}
          </button>
        </div>
      </form>

      {docs.length < 3 && (
        <form
          onSubmit={upload}
          className="admin-form"
          style={{ marginBottom: 24 }}
        >
          <h2>Upload a PDF ({docs.length}/3)</h2>
          <div className="admin-field-row">
            <div className="admin-field">
              <label>Title (EN)</label>
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label>Title (AR)</label>
              <input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                dir="rtl"
                required
              />
            </div>
          </div>
          <div className="admin-field">
            <label>PDF file</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
          </div>
          {uploadError && (
            <p style={{ color: "#d33", fontSize: 13 }}>{uploadError}</p>
          )}
          <div className="admin-form-actions">
            <button className="admin-btn" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="admin-loading">Loading...</p>
      ) : (
        <div className="admin-list">
          {docs.map((d) => (
            <div key={d.id} className="admin-card">
              <div>
                <strong>{d.title.en}</strong>{" "}
                <span style={{ color: "var(--mute)" }}>({d.title.ar})</span>
              </div>
              <button className="admin-btn danger" onClick={() => remove(d.id)}>
                Delete
              </button>
            </div>
          ))}
          {docs.length === 0 && (
            <p className="admin-empty">No documents uploaded yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
