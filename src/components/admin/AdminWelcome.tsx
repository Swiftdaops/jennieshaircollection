"use client";

import React, { useEffect, useState } from "react";
import { getGreetingMessage } from "./getGreetingMessage";

type Props = {
  pendingOrders: number;
  weeklySales: number;
};

export default function AdminWelcome({
  pendingOrders,
  weeklySales,
}: Props) {
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/config")
      .then((r) => r.ok ? r.json() : Promise.resolve({ adminName: "Admin" }))
      .then((data) => {
        if (mounted && data?.adminName) setAdminName(data.adminName);
      })
      .catch(() => {})
      .finally(() => { mounted = mounted; });
    return () => { mounted = false; };
  }, []);

  const message = getGreetingMessage({
    adminName,
    pendingOrders,
    weeklySales,
  });

  return (
    <div className="rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur">
      <p className="text-gray-800 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
}
