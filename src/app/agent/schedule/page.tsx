"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react";
import {
  TOUR_STATUS_LABEL,
  type TourStatus,
  getAgentTours,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const STATUS_META: Record<
  TourStatus,
  { tone: string; icon: typeof Clock3; marker: string }
> = {
  upcoming: {
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: Clock3,
    marker: "bg-sky-500",
  },
  completed: {
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
    marker: "bg-emerald-500",
  },
  canceled: {
    tone: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: XCircle,
    marker: "bg-rose-400",
  },
};

export default function AgentSchedulePage() {
  const agentId = useAgentScope();
  const tours = useMemo(() => getAgentTours(agentId), [agentId]);
  const [filter, setFilter] = useState<TourStatus | "all">("all");

  const grouped = useMemo(() => {
    const list = filter === "all" ? tours : tours.filter((t) => t.status === filter);
    const map = new Map<string, typeof list>();
    for (const tour of list) {
      const key = tour.dayLabel;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tour);
    }
    return Array.from(map.entries());
  }, [filter, tours]);

  const counts = useMemo(
    () => ({
      all: tours.length,
      upcoming: tours.filter((t) => t.status === "upcoming").length,
      completed: tours.filter((t) => t.status === "completed").length,
      canceled: tours.filter((t) => t.status === "canceled").length,
    }),
    [tours],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">تقویم بازدید</h1>
          <p className="mt-1 text-sm text-slate-500">
            تایم‌لاین روزانه بازدیدهای اختصاصی شما
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-3.5 py-2 text-sm text-slate-600 backdrop-blur-md">
          <CalendarDays className="h-4 w-4 text-emerald-600" />
          {counts.upcoming.toLocaleString("fa-IR")} بازدید پیش‌رو
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-full border border-slate-200/60 bg-white/80 p-1 backdrop-blur-md">
        {(
          [
            ["all", "همه", counts.all],
            ["upcoming", "Upcoming", counts.upcoming],
            ["completed", "Completed", counts.completed],
            ["canceled", "Canceled", counts.canceled],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition",
              filter === id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50",
            )}
          >
            {label}
            <span className="ms-1.5 tabular-nums opacity-70">
              {count.toLocaleString("fa-IR")}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {grouped.map(([day, dayTours]) => (
            <motion.section
              key={day}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="rounded-[1.75rem] border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md sm:p-6"
            >
              <h2 className="mb-4 text-sm font-semibold text-slate-900">{day}</h2>
              <ol className="relative space-y-4 border-s-2 border-slate-200/80 ps-5">
                {dayTours.map((tour, index) => {
                  const meta = STATUS_META[tour.status];
                  const Icon = meta.icon;
                  return (
                    <motion.li
                      key={tour.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.28, ease }}
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <span
                        className={cn(
                          "absolute -start-[1.6rem] top-3 h-3 w-3 rounded-full ring-4 ring-white",
                          meta.marker,
                        )}
                      />
                      <div className="rounded-2xl bg-[#F1EFEA]/70 p-4 ring-1 ring-slate-200/50">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-slate-900">{tour.propertyTitle}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              مشتری: {tour.clientName}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                              meta.tone,
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {TOUR_STATUS_LABEL[tour.status]}
                          </span>
                        </div>
                        <p className="mt-3 text-sm tabular-nums text-emerald-700">
                          ساعت {tour.time}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </motion.section>
          ))}
        </AnimatePresence>

        {grouped.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 py-10 text-center text-sm text-slate-500">
            بازدیدی در این فیلتر نیست.
          </p>
        )}
      </div>
    </div>
  );
}
