"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../providers";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Only redirect when we've finished the auth check and there's no user.
    if (loading === false && !user) {
      router.push("/admin/login");
    }
  }, [loading, user, router]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-nude text-stone-950">
      <div className="flex min-h-screen">
        {/* ================= DESKTOP SIDEBAR ================= */}
        {pathname !== "/admin/login" && (
          <aside className="hidden md:flex md:w-64 flex-col border-r border-zinc-200 bg-nude">
          <div className="p-4 border-b">
            <div className="text-lg font-semibold">Admin</div>
          </div>
          <nav className="p-4 flex flex-col gap-1">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/orders">Orders</NavLink>
            <NavLink href="/admin/stock">Stock</NavLink>
            <NavLink href="/admin/categories">Categories</NavLink>
            <NavLink href="/admin/inner-circle">Inner Circle</NavLink>
            <NavLink href="/admin/settings">Settings</NavLink>
          </nav>
          </aside>
        )}

        {/* ================= MAIN AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* ================= MOBILE TOP BAR ================= */}
          <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-nude px-3 py-2">
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="rounded p-2 hover:bg-nude/90"
            >
              ☰
            </button>
            <div className="font-medium">Admin</div>
            <div className="w-8" /> {/* spacer */}
          </header>

          {/* ================= PAGE CONTENT ================= */}
          <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && pathname !== "/admin/login" && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* drawer */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-nude border-r p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Admin</div>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="p-2"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              <NavLink href="/admin" onClick={() => setMobileOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink href="/admin/orders" onClick={() => setMobileOpen(false)}>
                Orders
              </NavLink>
              <NavLink href="/admin/stock" onClick={() => setMobileOpen(false)}>
                Stock
              </NavLink>
              <NavLink
                href="/admin/categories"
                onClick={() => setMobileOpen(false)}
              >
                Categories
              </NavLink>
              <NavLink href="/admin/inner-circle" onClick={() => setMobileOpen(false)}>
                Inner Circle
              </NavLink>
              <NavLink
                href="/admin/settings"
                onClick={() => setMobileOpen(false)}
              >
                Settings
              </NavLink>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ================= NAV LINK ================= */

function NavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded px-3 py-2 text-sm hover:bg-nude/90 transition"
    >
      {children}
    </Link>
  );
}
