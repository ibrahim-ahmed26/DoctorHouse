"use client";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth/authFetch";
import type { Lead, LeadStatus } from "@/lib/types";

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await authFetch("/api/admin/leads");
    const data = await res.json();
    setLeads(data.leads ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: LeadStatus) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await authFetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div>
      <div className="admin-header-row">
        <h1>Leads</h1>
      </div>
      {loading ? (
        <p className="admin-loading">Loading...</p>
      ) : leads.length === 0 ? (
        <p className="admin-empty">No leads yet.</p>
      ) : (
        <div className="admin-list">
          {leads.map((l) => (
            <div key={l.id} className="admin-card">
              <div>
                <strong>{l.name}</strong> &middot; {l.phone}
                <div
                  style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}
                >
                  {l.need} &middot; {new Date(l.createdAt).toLocaleString()}{" "}
                  &middot; {l.locale}
                </div>
              </div>
              <select
                value={l.status}
                onChange={(e) => setStatus(l.id, e.target.value as LeadStatus)}
                className={`badge ${l.status}`}
                style={{
                  border: "1.5px solid currentColor",
                  cursor: "pointer",
                }}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
