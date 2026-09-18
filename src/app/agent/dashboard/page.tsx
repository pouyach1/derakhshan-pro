"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import HeroBanner from "@/components/agent/dashboard/HeroBanner";
import MetricCards from "@/components/agent/dashboard/MetricCards";
import WorkspaceTabs from "@/components/agent/dashboard/WorkspaceTabs";
import { EASE } from "@/components/agent/dashboard/shared";
import {
  formatBillion,
  getAgentProfile,
  type AgentClient,
  type AgentCrmProfile,
  type AgentProperty,
  type AgentTask,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";
import { siteConfig } from "@/config/siteConfig";
import { api } from "@/lib/api";
import { fallbackImage } from "@/lib/money";
import { mapClientToAgent, mapPropertyToAgent } from "@/lib/mappers";
import type { ClientRecord, PropertyRecord, TourRecord } from "@/server/db/store";

export default function AgentDashboardPage() {
  const agentId = useAgentScope();
  const fallbackProfile = getAgentProfile(agentId);
  const [profile, setProfile] = useState<AgentCrmProfile>(fallbackProfile);
  const [properties, setProperties] = useState<AgentProperty[]>([]);
  const [clients, setClients] = useState<AgentClient[]>([]);
  const [tours, setTours] = useState<TourRecord[]>([]);

  useEffect(() => {
    void (async () => {
      const [propRes, clientRes, tourRes, agentsRes] = await Promise.all([
        api<{ items: PropertyRecord[] }>("/api/properties?pageSize=50"),
        api<{ items: ClientRecord[] }>("/api/clients"),
        api<{ items: TourRecord[] }>("/api/tours"),
        api<{ items: Array<{ id: string; name: string; avatarUrl: string | null; dealsClosed: number }> }>("/api/agents"),
      ]);
      if (propRes.ok) setProperties(propRes.data.items.map(mapPropertyToAgent));
      if (clientRes.ok) setClients(clientRes.data.items.map(mapClientToAgent));
      if (tourRes.ok) setTours(tourRes.data.items);
      if (agentsRes.ok) {
        const me = agentsRes.data.items.find((item) => item.id === agentId) || agentsRes.data.items[0];
        if (me) {
          setProfile({
            ...fallbackProfile,
            id: me.id,
            name: me.name,
            avatar: fallbackImage(me.avatarUrl),
            monthlyClosed: me.dealsClosed * 1_000_000_000 || fallbackProfile.monthlyClosed,
          });
        }
      }
    })();
  }, [agentId]);

  const metrics = useMemo(() => {
    const activeProperties = properties.filter((p) => p.status === "active").length;
    const negotiationCount = properties.filter((p) => p.status === "negotiation").length;
    const highUrgencyClients = clients.filter((c) => c.urgency === "high").length;
    const scheduledTours = tours.filter((t) => t.status === "upcoming").length;
    const negotiationValue = properties
      .filter((p) => p.status === "negotiation")
      .reduce((sum, p) => sum + p.price, 0);
    const estimatedCommission = Math.round((negotiationValue * profile.commissionRate) / 100);
    const soldCount = properties.filter((p) => p.status === "sold").length;
    return {
      activeProperties,
      negotiationCount,
      assignedClients: clients.length,
      highUrgencyClients,
      scheduledTours,
      todayTasks: scheduledTours,
      estimatedCommission,
      estimatedCommissionLabel: formatBillion(estimatedCommission),
      commissionRate: profile.commissionRate,
      targetProgress: Math.min(100, soldCount * 25 + (activeProperties > 0 ? 20 : 0)),
      monthlyClosedLabel: formatBillion(profile.monthlyClosed),
      monthlyTargetLabel: formatBillion(profile.monthlyTarget),
    };
  }, [properties, clients, tours, profile]);

  const tasks: AgentTask[] = tours.slice(0, 6).map((tour) => ({
    id: tour.id,
    agentId,
    kind: "visit",
    title: `بازدید ${tour.clientName}`,
    detail: tour.notes || "بازدید برنامه‌ریزی‌شده",
    time: tour.timeLabel,
    dayLabel: tour.dayLabel || "برنامه",
  }));

  return (
    <div className="space-y-5 pb-10 sm:space-y-6 sm:pb-14">
      <HeroBanner
        profile={profile}
        targetProgress={metrics.targetProgress}
        monthlyClosedLabel={metrics.monthlyClosedLabel}
        monthlyTargetLabel={metrics.monthlyTargetLabel}
      />
      <MetricCards metrics={metrics} />
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5, ease: EASE }}>
        <WorkspaceTabs
          agentId={agentId}
          properties={properties}
          clients={clients}
          tasks={tasks}
          commissionRate={metrics.commissionRate}
        />
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-amber-200/60 bg-gradient-to-l from-amber-50/90 via-white/80 to-emerald-50/80 p-5"
      >
        <p className="text-xs font-medium text-amber-800">نکته دفتر</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          فایل‌ها و مشتریان {siteConfig.brand.nameFa} از داده زنده خوانده می‌شوند
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          ثبت ملک، لید و بازدید در پنل ذخیره می‌شود و روی داشبورد و سایت عمومی دیده می‌شود.
        </p>
      </motion.section>
    </div>
  );
}
