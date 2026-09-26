"use client";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth/authFetch";
import { auth } from "@/lib/firebase/authClient";

type DashUser = {
  uid: string;
  email: string;
  createdAt: string;
  role: "super_admin" | "admin";
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<DashUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await authFetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await authFetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setSaving(false);
      return;
    }
    setEmail("");
    setPassword("");
    setRole("admin");
    setShowForm(false);
    setSaving(false);
    await load();
  }

  async function removeUser(uid: string) {
    if (!confirm("Remove this user's dashboard access?")) return;
    await authFetch(`/api/admin/users/${uid}`, { method: "DELETE" });
    await load();
  }

  async function changeRole(uid: string, newRole: "admin" | "super_admin") {
    await authFetch(`/api/admin/users/${uid}`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });
    await load();
  }

  return (
    <div>
      <div className="admin-header-row">
        <h1>Dashboard users</h1>
        <button className="admin-btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add user"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={addUser}
          className="admin-form"
          style={{ marginBottom: 24 }}
        >
          <h2>New dashboard user</h2>
          <div className="admin-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label>Temporary password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="admin-field">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              style={{
                padding: 10,
                border: "1px solid var(--line)",
                borderRadius: 8,
              }}
            >
              <option value="admin">
                Normal Administrator — Doctors & Leads only
              </option>
              <option value="super_admin">
                Super Administrator — Full access, incl. Users
              </option>
            </select>
          </div>
          {error && <p style={{ color: "#d33", fontSize: 13 }}>{error}</p>}
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? "Adding..." : "Add user"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="admin-loading">Loading...</p>
      ) : (
        <div className="admin-list">
          {users.map((u) => (
            <div key={u.uid} className="admin-card">
              <div>
                <strong>{u.email}</strong>
                <div
                  style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}
                >
                  Added {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {auth.currentUser?.uid === u.uid ? (
                  <span
                    className={`badge ${u.role === "super_admin" ? "done" : "contacted"}`}
                  >
                    {u.role === "super_admin"
                      ? "Super Administrator"
                      : "Administrator"}{" "}
                    (you)
                  </span>
                ) : (
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.uid, e.target.value as any)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--line)",
                    }}
                  >
                    <option value="admin">Administrator</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                )}
                {auth.currentUser?.uid !== u.uid && (
                  <button
                    className="admin-btn danger"
                    onClick={() => removeUser(u.uid)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
