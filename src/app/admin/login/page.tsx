"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/authClient";
// @ts-ignore -- Next.js handles CSS imports; TypeScript may not resolve this side-effect import.
import "../admin.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/doctors");
    } catch {
      setError("Wrong email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <h1>Doctor House Care</h1>
        <p className="sub">Sign in to manage the site</p>
        <div className="admin-login-field">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="admin-login-field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="admin-login-error">{error}</p>}
        <button className="admin-login-btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
