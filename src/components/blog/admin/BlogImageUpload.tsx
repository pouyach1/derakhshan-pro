type BlogImageUploadProps = {
  value?: string;
  label?: string;
};

/** Phase 1 placeholder — no real upload. */
export default function BlogImageUpload({
  value = "",
  label = "تصویر کاور",
}: BlogImageUploadProps) {
  return (
    <div className="space-y-2" dir="rtl">
      <p className="text-sm font-medium text-admin-navy">{label}</p>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-admin-soft px-4 py-8 text-center text-xs text-slate-500">
        آپلود تصویر در فازهای بعدی فعال می‌شود
        {value ? (
          <p className="mt-2 break-all font-mono text-[11px] text-slate-600" dir="ltr">
            {value}
          </p>
        ) : null}
      </div>
    </div>
  );
}
