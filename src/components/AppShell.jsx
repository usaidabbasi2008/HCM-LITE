"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/authClient";
import { MENUS } from "@/lib/menus";
import { Spinner } from "./ui";

export default function AppShell({ role, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.mustChangePassword) router.replace("/change-password");
    else if (user.role !== role) router.replace(`/${user.role}`);
  }, [user, loading, role, router]);

  if (loading || !user || user.role !== role || user.mustChangePassword) return <Spinner />;

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-60 transform bg-slate-900 p-4 text-slate-200 transition md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="mb-6 text-lg font-bold text-white">HCM Lite</h2>
        <nav className="space-y-1">
          {MENUS[role].map((m) => (
            <Link
              key={m.href}
              href={m.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm ${
                path === m.href ? "bg-teal-600 text-white" : "hover:bg-slate-800"
              }`}
            >
              {m.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3">
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            ☰
          </button>
          <span className="text-sm text-slate-500">
            {user.name} · <span className="capitalize">{user.role}</span>
          </span>
          <button
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>
        <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}