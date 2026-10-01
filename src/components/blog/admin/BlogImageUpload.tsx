type BlogImageUploadProps = {
  value?: string;
  label?: string;
  name?: string;
};

/** Cover image field — upload deferred; URL editable for form readiness. */
export default function BlogImageUpload({
  value = "",
  label = "تصویر اصلی",
  name = "coverImage",
}: BlogImageUploadProps) {
  return (
    <div className="space-y-2" dir="rtl">
      <label htmlFor={name} className="text-sm font-medium text-ws-text">
        {label}
      </label>
      <div className="rounded-[1.25rem] border border-dashed border-white/15 bg-ws-elevated px-4 py-5">
        <input
          id={name}
          name={name}
          type="text"
          dir="ltr"
          defaultValue={value}
          placeholder="/images/..."
          className="h-11 w-full rounded-2xl border border-white/10 bg-ws-surface px-4 text-sm text-ws-text outline-none transition duration-200 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/15"
        />
        <p className="mt-2 text-xs leading-6 text-ws-muted">
          آپلود فایل در فاز بک‌اند فعال می‌شود. فعلاً مسیر تصویر موجود را وارد کنید.
        </p>
      </div>
    </div>
  );
}
