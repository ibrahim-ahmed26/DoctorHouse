"use client";
import { useEffect, useState, ReactNode } from "react";
import toast from "react-hot-toast";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { clientAuth } from "@/lib/docs/client";

type State = "loading" | "out" | "in";
const ALLOWED = ["viewer", "admin", "super_admin"];

export default function DocumentsGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>("loading");
  const [mode, setMode] = useState<"login" | "request">("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(clientAuth(), async (u) => {
      if (!u) return setState("out");
      const t = await u.getIdTokenResult(true);
      setState(ALLOWED.includes(String(t.claims.role)) ? "in" : "out");
    });
  }, []);

  const login = async () => {
    setBusy(true);
    try {
      await signInWithEmailAndPassword(
        clientAuth(),
        f.email.trim(),
        f.password,
      );
    } catch (e: any) {
      toast.error(
        e?.code === "auth/user-disabled"
          ? "Your request is still waiting for approval."
          : "Wrong email or password.",
      );
    }
    setBusy(false);
  };

  const request = async () => {
    setBusy(true);
    const id = toast.loading("Sending request…");
    const res = await fetch("/api/documents/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      toast.success(
        "Request sent. You can sign in once the admin approves it.",
        { id, duration: 6000 },
      );
      setMode("login");
    } else toast.error(data.error || "Failed", { id });
    setBusy(false);
  };

  if (state === "loading") return <div style={{ minHeight: "60vh" }} />;

  if (state === "in")
    return (
      <>
        {children}
        <div className="gate-foot">
          <button
            className="btn gate-signout"
            onClick={() => signOut(clientAuth())}
          >
            Sign out
          </button>
        </div>
      </>
    );

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  return (
    <section className="gate">
      <form
        className="gate-card"
        onSubmit={(e) => {
          e.preventDefault();
          mode === "login" ? login() : request();
        }}
      >
        <h2>{mode === "login" ? "Doctor's Guides" : "Request access"}</h2>
        <p className="gate-sub">
          {mode === "login"
            ? "Sign in with your approved account."
            : "The admin reviews every request."}
        </p>
        {mode === "request" && (
          <input
            required
            placeholder="Full name"
            value={f.name}
            onChange={set("name")}
          />
        )}
        <input
          required
          type="email"
          placeholder="Email"
          value={f.email}
          onChange={set("email")}
        />
        <input
          required
          type="password"
          minLength={8}
          placeholder="Password (8+ characters)"
          value={f.password}
          onChange={set("password")}
        />
        <button className="btn brass gate-submit" disabled={busy} type="submit">
          {mode === "login" ? "Sign in" : "Send request"}
        </button>
        <button
          type="button"
          className="gate-switch"
          onClick={() => setMode(mode === "login" ? "request" : "login")}
        >
          {mode === "login"
            ? "No account? Request access"
            : "Already approved? Sign in"}
        </button>
      </form>
    </section>
  );
}
