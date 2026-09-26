"use client";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth/authFetch";
import DoctorForm from "@/components/admin/DoctorForm";
import type { Doctor } from "@/lib/types";

export default function DoctorsAdminPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Doctor | "new" | null>(null);

  async function load() {
    setLoading(true);
    const res = await authFetch("/api/admin/doctors");
    const data = await res.json();
    setDoctors(data.doctors ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(draft: Omit<Doctor, "id">) {
    try {
      const res =
        editing === "new"
          ? await authFetch("/api/admin/doctors", {
              method: "POST",
              body: JSON.stringify(draft),
            })
          : await authFetch(`/api/admin/doctors/${(editing as Doctor).id}`, {
              method: "PUT",
              body: JSON.stringify(draft),
            });

      const data = await res.json();
      if (!res.ok) {
        alert(`Save failed: ${data.error ?? res.status}`);
        return;
      }
    } catch (err: any) {
      alert(`Save failed: ${err.message ?? err}`);
      return;
    }
    setEditing(null);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this doctor?")) return;
    await authFetch(`/api/admin/doctors/${id}`, { method: "DELETE" });
    await load();
  }

  if (editing) {
    return (
      <DoctorForm
        initial={editing === "new" ? undefined : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="admin-header-row">
        <h1>Doctors</h1>
        <button className="admin-btn" onClick={() => setEditing("new")}>
          + Add doctor
        </button>
      </div>

      {loading ? (
        <p className="admin-loading">Loading...</p>
      ) : doctors.length === 0 ? (
        <p className="admin-empty">No doctors yet.</p>
      ) : (
        <div className="admin-list">
          {doctors.map((d) => (
            <div key={d.id} className="admin-card">
              <div>
                <strong>{d.name.en}</strong>{" "}
                <span style={{ color: "var(--mute)" }}>({d.name.ar})</span>
                <div
                  style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}
                >
                  {d.specialty.en} — order {d.order}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="admin-btn outline"
                  onClick={() => setEditing(d)}
                >
                  Edit
                </button>
                <button
                  className="admin-btn danger"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
