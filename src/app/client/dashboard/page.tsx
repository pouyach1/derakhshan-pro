"use client";

import { useEffect, useState } from "react";
import ClientDashboardView from "@/components/client/ClientDashboardView";
import { readClientSession } from "@/lib/auth";
import { api } from "@/lib/api";
import type { PropertyRecord } from "@/server/db/store";

export default function ClientDashboardPage() {
  const [name, setName] = useState("");
  const [items, setItems] = useState<PropertyRecord[]>([]);

  useEffect(() => {
    const session = readClientSession();
    setName(session?.clientProfile?.fullName || session?.name || "موکل");
    void (async () => {
      const res = await api<{ items: PropertyRecord[] }>("/api/properties?pageSize=12");
      if (res.ok) setItems(res.data.items);
    })();
  }, []);

  return <ClientDashboardView name={name || "موکل"} items={items} />;
}
