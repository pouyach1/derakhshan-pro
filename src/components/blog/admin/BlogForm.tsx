import type { BlogPost } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/data/blog";
import BlogImageUpload from "@/components/blog/admin/BlogImageUpload";

type BlogFormProps = {
  initial?: Partial<BlogPost>;
  mode?: "create" | "edit";
};

/** Phase 1 structural form — no submit / API. */
export default function BlogForm({ initial, mode = "create" }: BlogFormProps) {
  return (
    <div
      className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 md:p-6"
      dir="rtl"
    >
      <p className="text-xs font-semibold text-sky-600">
        {mode === "edit" ? "ویرایش مقاله (فاز ۱ — بدون ذخیره)" : "مقاله جدید (فاز ۱ — بدون ذخیره)"}
      </p>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-admin-navy">عنوان</span>
        <input
          defaultValue={initial?.title ?? ""}
          className="h-11 w-full rounded-2xl bg-admin-soft px-4 text-sm outline-none ring-1 ring-transparent focus:bg-white focus:ring-admin-sky/50"
          readOnly
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-admin-navy">اسلاگ</span>
        <input
          defaultValue={initial?.slug ?? ""}
          dir="ltr"
          className="h-11 w-full rounded-2xl bg-admin-soft px-4 text-sm outline-none ring-1 ring-transparent focus:bg-white focus:ring-admin-sky/50"
          readOnly
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-admin-navy">دسته</span>
        <select
          defaultValue={initial?.category ?? BLOG_CATEGORIES[0]}
          className="h-11 w-full rounded-2xl bg-admin-soft px-4 text-sm outline-none"
          disabled
        >
          {BLOG_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-admin-navy">خلاصه</span>
        <textarea
          defaultValue={initial?.excerpt ?? ""}
          rows={3}
          className="w-full rounded-2xl bg-admin-soft px-4 py-3 text-sm outline-none"
          readOnly
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-admin-navy">متن</span>
        <textarea
          defaultValue={initial?.content ?? ""}
          rows={8}
          className="w-full rounded-2xl bg-admin-soft px-4 py-3 text-sm outline-none"
          readOnly
        />
      </label>

      <BlogImageUpload value={initial?.coverImage} />

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          className="rounded-full bg-admin-navy px-5 py-2.5 text-sm font-semibold text-white opacity-60"
          disabled
        >
          ذخیره (غیرفعال در فاز ۱)
        </button>
        <button
          type="button"
          className="rounded-full bg-admin-soft px-5 py-2.5 text-sm font-semibold text-admin-navy opacity-60"
          disabled
        >
          پیش‌نویس
        </button>
      </div>
    </div>
  );
}
