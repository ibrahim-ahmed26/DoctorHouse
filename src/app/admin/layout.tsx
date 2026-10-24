"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/authClient";
import "./admin.css";

type Role = "super_admin" | "admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [role, setRole] = useState<Role>("admin");
  const [pending, setPending] = useState(0);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        if (!isLoginPage) router.replace("/admin/login");
        return;
      }
      const result = await u.getIdTokenResult();
      const r = result.claims.role;
      // Only real admins may see the dashboard (document viewers are signed out).
      if (r !== "admin" && r !== "super_admin") {
        await signOut(auth);
        setUser(null);
        if (!isLoginPage) router.replace("/admin/login");
        return;
      }
      setUser(u);
      setRole(r as Role);
      if (r !== "super_admin" && pathname?.startsWith("/admin/users")) {
        router.replace("/admin/doctors");
      }
    });
    return unsub;
  }, [isLoginPage, pathname, router]);

  // Pending document-access requests -> badge in the sidebar.
  useEffect(() => {
    if (!user) return;
    let stop = false;
    const load = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/viewers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const d = await res.json();
        if (!stop)
          setPending(
            d.viewers.filter((v: { approved: boolean }) => !v.approved).length,
          );
      } catch {}
    };
    load();
    const id = setInterval(load, 60000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [user, pathname]);

  if (isLoginPage) return <>{children}</>;
  if (user === undefined)
    return <div className="admin-loading">Checking session...</div>;
  if (!user) return null;

  const link = (href: string, label: string, badge = 0) => (
    <a href={href} className={pathname?.startsWith(href) ? "active" : ""}>
      {label}
      {badge > 0 && <span className="nav-badge">{badge}</span>}
    </a>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">🏠 Doctor House</div>
        <nav className="admin-nav">
          {link("/admin/doctors", "Doctors")}
          {link("/admin/leads", "Leads")}
          {link("/admin/faqs", "FAQs")}
          {link("/admin/access", "Document accounts", pending)}
          {role === "super_admin" && link("/admin/users", "Users")}
          {role === "super_admin" && link("/admin/documents", "Documents")}
        </nav>
        <div className="admin-user">
          {user.email}
          <div style={{ opacity: 0.7, fontSize: 11, marginTop: 2 }}>
            {role === "super_admin" ? "Super Administrator" : "Administrator"}
          </div>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
