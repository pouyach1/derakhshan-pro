"use client";

import ChatDesk from "@/components/chat/ChatDesk";

export default function AdminSupportChatPage() {
  return (
    <ChatDesk
      kind="support"
      title="چت پشتیبانی"
      subtitle="پیام‌های مشتریان و موکلان را اینجا پاسخ دهید. گفتگوها به‌صورت زنده به‌روز می‌شوند."
      emptyHint="هنوز درخواست پشتیبانی ثبت نشده است. وقتی مشتری از پنل خود پیام بفرستد اینجا دیده می‌شود."
      composerPlaceholder="پاسخ پشتیبانی را بنویسید…"
    />
  );
}
