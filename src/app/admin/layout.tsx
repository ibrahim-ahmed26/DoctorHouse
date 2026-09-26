"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/authClient";
// The stylesheet is loaded by the admin route; suppress TypeScript's
// side-effect import check when CSS type declarations are unavailable.
// @ts-expect-error CSS files do not have TypeScript declarations.
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [role, setRole] = useState<"super_admin" | "admin">("admin");
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        if (!isLoginPage) router.replace("/admin/login");
        return;
      }
      const result = await u.getIdTokenResult();
      setRole((result.claims.role as "super_admin" | "admin") ?? "admin");
      // Non-super-admins can't be on /admin/users — bounce them.
      if (
        (result.claims.role ?? "admin") !== "super_admin" &&
        pathname?.startsWith("/admin/users")
      ) {
        router.replace("/admin/doctors");
      }
    });
    return unsub;
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) return <>{children}</>;
  if (user === undefined)
    return <div className="admin-loading">Checking session...</div>;
  if (!user) return null;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">🏠 Doctor House</div>
        <nav className="admin-nav">
          <a
            href="/admin/doctors"
            className={pathname?.startsWith("/admin/doctors") ? "active" : ""}
          >
            Doctors
          </a>
          <a
            href="/admin/leads"
            className={pathname?.startsWith("/admin/leads") ? "active" : ""}
          >
            Leads
          </a>
          {role === "super_admin" && (
            <a
              href="/admin/users"
              className={pathname?.startsWith("/admin/users") ? "active" : ""}
            >
              Users
            </a>
          )}
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
