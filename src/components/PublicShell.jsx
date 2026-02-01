"use client";

import { usePathname } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";

export default function PublicShell({ children }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <PublicNavbar />
      {children}
      <Footer />
    </>
  );
}
