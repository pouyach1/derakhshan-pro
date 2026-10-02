"use client";

import ChatDesk from "@/components/chat/ChatDesk";

export default function ClientSupportChatPage() {
  return (
    <div className="min-h-dvh bg-[#F3F7FB] px-3 py-6 sm:px-6 md:px-8" dir="rtl" lang="fa">
      <div className="mx-auto max-w-6xl">
        <ChatDesk
          kind="support"
          ensureOwn
          title="پشتیبانی آنلاین"
          subtitle="مستقیم با تیم دفتر صحبت کنید — سوال ملک، بازدید و هماهنگی قرارداد."
          emptyHint="گفتگوی پشتیبانی شما در حال آماده‌سازی است…"
          composerPlaceholder="سوال یا درخواست خود را بنویسید…"
          backHref="/client/dashboard"
          backLabel="بازگشت به پنل"
        />
      </div>
    </div>
  );
}
