"use client";

import ChatDesk from "@/components/chat/ChatDesk";

export default function AgentAdminChatPage() {
  return (
    <ChatDesk
      kind="admin"
      ensureOwn
      title="گفتگو با ادمین‌ها"
      subtitle="هماهنگی مستقیم با میز مدیریت دفتر — اولویت فایل‌ها، تاییدها و پیگیری داخلی."
      emptyHint="گفتگوی شما با ادمین در حال آماده‌سازی است…"
      composerPlaceholder="پیام برای ادمین…"
    />
  );
}
