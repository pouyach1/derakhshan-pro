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
      <label htmlFor={name} className="text-sm font-medium text-[#0B3A5C]">
        {label}
      </label>
      <div className="rounded-[1.25rem] border border-dashed border-sky-200/80 bg-[#F3F7FB]/80 px-4 py-5">
        <input
          id={name}
          name={name}
          type="text"
          dir="ltr"
          defaultValue={value}
          placeholder="/images/..."
          className="h-11 w-full rounded-2xl border border-sky-100/80 bg-white px-4 text-sm text-[#0B3A5C] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10"
        />
        <p className="mt-2 text-xs leading-6 text-[#0B3A5C]/45">
          آپلود فایل در فاز بک‌اند فعال می‌شود. فعلاً مسیر تصویر موجود را وارد کنید.
        </p>
      </div>
    </div>
  );
}
