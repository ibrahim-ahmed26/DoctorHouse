"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authFetch } from "@/lib/docs/client";

type V = {
  uid: string;
  name: string;
  email: string;
  approved: boolean;
  created: string;
};

export default function AdminAccess() {
  const [rows, setRows] = useState<V[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await authFetch("/api/admin/viewers");
    if (res.ok) setRows((await res.json()).viewers);
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const act = async (v: V, action: "approve" | "suspend" | "delete") => {
    if (action === "delete" && !confirm(`Remove ${v.email}?`)) return;
    const res = await authFetch(`/api/admin/viewers/${v.uid}`, {
      method: action === "delete" ? "DELETE" : "PATCH",
      body: action === "delete" ? undefined : JSON.stringify({ action }),
    });
    if (res.ok) {
      toast.success(
        action === "approve"
          ? "Approved"
          : action === "suspend"
            ? "Suspended"
            : "Removed",
      );
      load();
    } else toast.error("Failed");
  };

  const pending = rows.filter((r) => !r.approved);
  const approved = rows.filter((r) => r.approved);
  const date = (s: string) => new Date(s).toLocaleDateString();

  const Row = ({ v }: { v: V }) => (
    <div className="adm-card adm-row">
      <div className="adm-row-main">
        <strong>{v.name || "—"}</strong>
        <div className="adm-muted">
          {v.email} · requested {date(v.created)}
        </div>
      </div>
      <div className="adm-row-actions">
        {v.approved ? (
          <button className="adm-btn" onClick={() => act(v, "suspend")}>
            Suspend
          </button>
        ) : (
          <button
            className="adm-btn adm-btn-primary"
            onClick={() => act(v, "approve")}
          >
            Approve
          </button>
        )}
        <button
          className="adm-btn adm-btn-danger"
          onClick={() => act(v, "delete")}
        >
          {v.approved ? "Remove" : "Deny"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="adm-page">
      <div className="adm-head">
        <h1 className="adm-title">Document accounts</h1>
        <span className="adm-count">{pending.length} pending</span>
      </div>

      <h2 className="adm-sub">Waiting for approval</h2>
      {loading && <p className="adm-muted">Loading…</p>}
      {!loading && pending.length === 0 && (
        <p className="adm-muted">No pending requests.</p>
      )}
      <div className="adm-list">
        {pending.map((v) => (
          <Row key={v.uid} v={v} />
        ))}
      </div>

      <h2 className="adm-sub" style={{ marginTop: 32 }}>
        Approved ({approved.length})
      </h2>
      <div className="adm-list">
        {approved.map((v) => (
          <Row key={v.uid} v={v} />
        ))}
      </div>
    </div>
  );
}
