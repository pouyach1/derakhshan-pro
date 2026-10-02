"use client";

import ChatDesk from "@/components/chat/ChatDesk";

export default function AdminTeamChatPage() {
  return (
    <ChatDesk
      kind="admin"
      title="چت مخصوص ادمین‌ها"
      subtitle="گفتگوی مستقیم مشاوران با میز ادمین — هماهنگی فایل، اولویت‌ها و تصمیم‌های دفتر."
      emptyHint="هنوز مشاوری گفتگو باز نکرده است. مشاوران از پنل خود به میز ادمین پیام می‌فرستند."
      composerPlaceholder="پیام به مشاور…"
    />
  );
}
