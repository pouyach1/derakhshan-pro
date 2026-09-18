"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { formatToman } from "@/lib/money";
import { siteConfig } from "@/config/siteConfig";
import type { ClientRecord } from "@/server/db/store";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    preferredNeighborhood: siteConfig.contact.address.city as string,
    urgency: "medium" as "low" | "medium" | "high",
    agentId: "",
    note: "",
  });

  async function load() {
    const [clientsRes, agentsRes] = await Promise.all([
      api<{ items: ClientRecord[] }>("/api/clients"),
      api<{ items: Array<{ id: string; name: string }> }>("/api/agents"),
    ]);
    if (!clientsRes.ok) {
      setError(clientsRes.error.message);
      return;
    }
    setClients(clientsRes.data.items);
    if (agentsRes.ok) {
      setAgents(agentsRes.data.items);
      setDraft((d) => ({ ...d, agentId: d.agentId || agentsRes.data.items[0]?.id || "" }));
    }
    setError("");
  }

  useEffect(() => {
    void load();
  }, []);

  async function createClient() {
    if (!draft.name.trim() || !draft.phone.trim()) {
      setError("نام و موبایل مشتری الزامی است");
      return;
    }
    setSaving(true);
    const res = await api("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        preferredNeighborhood: draft.preferredNeighborhood,
        urgency: draft.urgency,
        intent: "buy",
        budgetMin: 0,
        budgetMax: 0,
        agentId: draft.agentId || undefined,
        notes: draft.note.trim() ? [{ text: draft.note.trim() }] : [],
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setDraft((d) => ({ ...d, name: "", phone: "", note: "" }));
    await load();
  }

  async function setUrgency(id: string, urgency: ClientRecord["urgency"]) {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, urgency } : c)));
    const res = await api(`/api/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ urgency }),
    });
    if (!res.ok) void load();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">مشتریان دفتر</h1>
        <p className="mt-1 text-sm text-slate-500">پیگیری موکلان اختصاصی مشاوران</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <input className={inputClass} placeholder="نام" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          <input className={inputClass} placeholder="موبایل" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
          <input className={inputClass} placeholder="محله ترجیحی" value={draft.preferredNeighborhood} onChange={(e) => setDraft((d) => ({ ...d, preferredNeighborhood: e.target.value }))} />
          <select className={inputClass} value={draft.urgency} onChange={(e) => setDraft((d) => ({ ...d, urgency: e.target.value as typeof draft.urgency }))}>
            <option value="low">عادی</option>
            <option value="medium">متوسط</option>
            <option value="high">فوری</option>
          </select>
          <select className={inputClass} value={draft.agentId} onChange={(e) => setDraft((d) => ({ ...d, agentId: e.target.value }))}>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
          <button type="button" disabled={saving} onClick={() => void createClient()} className="h-11 rounded-full bg-admin-sky text-sm font-medium text-white disabled:opacity-60">
            {saving ? "..." : "ثبت مشتری"}
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {clients.map((client, index) => (
          <motion.article
            key={client.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-[1.5rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-admin-navy">{client.name}</h2>
                <p className="mt-1 text-xs text-slate-500" dir="ltr">{client.phone}</p>
              </div>
              <select
                className="rounded-full bg-admin-soft px-2.5 py-1 text-xs"
                value={client.urgency}
                onChange={(e) => void setUrgency(client.id, e.target.value as ClientRecord["urgency"])}
              >
                <option value="low">عادی</option>
                <option value="medium">متوسط</option>
                <option value="high">فوری</option>
              </select>
            </div>
            <p className="mt-3 text-sm text-slate-600">محله: {client.preferredNeighborhood || "—"}</p>
            <p className="mt-1 text-sm text-slate-600">
              بودجه: {formatToman(client.budgetMin)} تا {formatToman(client.budgetMax)}
            </p>
            <p className="mt-3 text-xs text-slate-400">
              یادداشت‌ها: {client.notes.length.toLocaleString("fa-IR")}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-2xl bg-admin-soft px-4 text-sm text-admin-navy outline-none focus:ring-2 focus:ring-admin-sky/40";
