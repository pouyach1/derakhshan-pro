"use client";

import { motion } from "framer-motion";
import HeroBanner from "@/components/agent/dashboard/HeroBanner";
import MetricCards from "@/components/agent/dashboard/MetricCards";
import WorkspaceTabs from "@/components/agent/dashboard/WorkspaceTabs";
import { EASE } from "@/components/agent/dashboard/shared";
import {
  getAgentClients,
  getAgentCrmMetrics,
  getAgentProfile,
  getAgentProperties,
  getAgentTasks,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";

export default function AgentDashboardPage() {
  const agentId = useAgentScope();
  const profile = getAgentProfile(agentId);
  const metrics = getAgentCrmMetrics(agentId);
  const properties = getAgentProperties(agentId);
  const clients = getAgentClients(agentId);
  const tasks = getAgentTasks(agentId);

  return (
    <div className="space-y-5 pb-10 sm:space-y-6 sm:pb-14">
      <HeroBanner
        profile={profile}
        targetProgress={metrics.targetProgress}
        monthlyClosedLabel={metrics.monthlyClosedLabel}
        monthlyTargetLabel={metrics.monthlyTargetLabel}
      />

      <MetricCards
        metrics={{
          activeProperties: metrics.activeProperties,
          negotiationCount: metrics.negotiationCount,
          assignedClients: metrics.assignedClients,
          highUrgencyClients: metrics.highUrgencyClients,
          scheduledTours: metrics.scheduledTours,
          todayTasks: metrics.todayTasks,
          estimatedCommissionLabel: metrics.estimatedCommissionLabel,
          estimatedCommission: metrics.estimatedCommission,
          commissionRate: metrics.commissionRate,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: EASE }}
      >
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
        transition={{ delay: 0.32, duration: 0.45, ease: EASE }}
        className="rounded-[1.75rem] border border-amber-200/60 bg-gradient-to-l from-amber-50/90 via-white/80 to-emerald-50/80 p-5 shadow-xl shadow-amber-100/40 backdrop-blur-xl sm:p-6"
      >
        <p className="text-xs font-medium text-amber-800">نکته VIP دفتر</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          تمرکز این هفته: بستن مذاکره‌های نیاوران و لواسان
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          دو فایل در وضعیت مذاکره ظرفیت کمیسیون قابل‌توجهی دارند. پیشنهاد می‌شود قبل از پایان هفته،
          یک جلسه سه‌جانبه با مالک و خریدار برای هر پرونده تنظیم کنید و یادداشت پیش‌قرارداد را از
          تب ابزارها صادر نمایید.
        </p>
      </motion.section>
    </div>
  );
}
