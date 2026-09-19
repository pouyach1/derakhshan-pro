"use client";

import { useEffect, useState } from "react";
import ClientDashboardView from "@/components/client/ClientDashboardView";
import { displayNameForSession, readClientSession } from "@/lib/auth";
import { api } from "@/lib/api";
import type { PropertyRecord } from "@/server/db/store";

export default function ClientDashboardPage() {
  const [name, setName] = useState("موکل");
  const [items, setItems] = useState<PropertyRecord[]>([]);

  useEffect(() => {
    const local = readClientSession();
    if (local) setName(displayNameForSession(local));

    void (async () => {
      const [me, props] = await Promise.all([
        api<{ session: Parameters<typeof displayNameForSession>[0] }>("/api/auth/me"),
        api<{ items: PropertyRecord[] }>("/api/properties?pageSize=12"),
      ]);
      if (me.ok && me.data.session) {
        setName(displayNameForSession(me.data.session));
      }
      if (props.ok) setItems(props.data.items);
    })();
  }, []);

  return <ClientDashboardView name={name || "موکل"} items={items} />;
}
