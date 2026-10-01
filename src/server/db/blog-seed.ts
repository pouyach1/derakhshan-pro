/**
 * Deterministic editorial seed — migrated from former mock src/data/blog.ts.
 * Used only when AgencyStore.blogPosts is empty.
 */

import type { BlogPostRecord } from "@/server/database/schema";

type SeedBlogPost = Omit<
  BlogPostRecord,
  "authorUserId" | "authorAgentId" | "softDeleted" | "createdAt" | "updatedAt"
> & {
  authorName: string;
};

export const BLOG_SEED_AUTHORS: Record<
  string,
  { userId: string; agentId: string | null; name: string; avatarUrl: string; email: string; phone: string }
> = {
  "آرش شایگان": {
    userId: "agent-1",
    agentId: "a1",
    name: "آرش شایگان",
    avatarUrl: "/images/admin/avatars/arash-shayegan.jpg",
    email: "agent@vorqen.ir",
    phone: "09122113456",
  },
  "سارا نوری": {
    userId: "agent-sara",
    agentId: "a-sara",
    name: "سارا نوری",
    avatarUrl: "/images/admin/avatars/sara-nouri.jpg",
    email: "sara.nouri@vorqen.ir",
    phone: "09125556789",
  },
  "کاوه مرادی": {
    userId: "agent-3",
    agentId: "a3",
    name: "کاوه مرادی",
    avatarUrl: "/images/admin/avatars/kaveh-moradi.jpg",
    email: "kaveh@vorqen.ir",
    phone: "09124445678",
  },
};

export const BLOG_SEED_POSTS: SeedBlogPost[] = [
  {
    id: "blog-1",
    title: "چک‌لیست خرید آپارتمان در گوهردشت کرج",
    slug: "checklist-kharid-aparteman-gohardasht",
    excerpt:
      "قبل از امضای قولنامه در گوهردشت، این موارد را حتماً بررسی کنید تا ریسک معامله پایین بیاید.",
    content:
      "خرید آپارتمان در گوهردشت هنوز یکی از پرتقاضاترین انتخاب‌های خانواده‌های کرجی است. در این مطلب مسیر بازدید، کنترل سند، هزینه‌های نقل‌وانتقال و نکات قرارداد را به‌صورت مرحله‌به‌مرحله مرور می‌کنیم.\n\nاول از همه، وضعیت پارکینگ، انباری و پایان‌کار را از روی مدارک کنترل کنید. سپس دسترسی به مترو، مدارس و مراکز خرید را با نیاز روزمره خود بسنجید.\n\nدر نهایت، قیمت پیشنهادی را با چند معامله مشابه همان کوچه مقایسه کنید تا خارج از عرف بازار وارد مذاکره نشوید.",
    coverImage: "/images/admin/properties/fereshteh-apt.jpg",
    category: "خرید ملک",
    authorName: "آرش شایگان",
    status: "published",
    publishedAt: "2026-03-12T09:00:00.000Z",
    readingTime: 6,
  },
  {
    id: "blog-2",
    title: "چطور ویلای مهرشهر را سریع‌تر و امن‌تر بفروشیم؟",
    slug: "foroosh-villa-mehrshahr",
    excerpt:
      "آماده‌سازی ملک، قیمت‌گذاری واقع‌بینانه و ارائهٔ مدارک کامل، سه عامل اصلی فروش سریع ویلا در مهرشهر است.",
    content:
      "فروش ویلا در مهرشهر بیش از آن‌که به آگهی زیاد وابسته باشد، به کیفیت ارائهٔ فایل بستگی دارد. عکس حرفه‌ای، مترکشی دقیق و شفاف‌سازی حریم باغ، اعتماد خریدار را بالا می‌برد.\n\nقیمت را بر اساس متراژ بنا، متراژ زمین و امکانات نگهبانی تنظیم کنید؛ نه فقط بر اساس انتظار مالک.\n\nهمراهی حقوقی از همان ابتدای مذاکره، احتمال فسخ و رفت‌وبرگشت‌های فرسایشی را کم می‌کند.",
    coverImage: "/images/admin/properties/lavasan-duplex.jpg",
    category: "فروش ملک",
    authorName: "سارا نوری",
    status: "published",
    publishedAt: "2026-03-18T11:30:00.000Z",
    readingTime: 5,
  },
  {
    id: "blog-3",
    title: "سرمایه‌گذاری در عظیمیه: آپارتمان یا دفتر اداری؟",
    slug: "sarmayegozari-azimiyeh",
    excerpt:
      "مقایسهٔ بازده اجاره، نقدشوندگی و ریسک نگهداری بین آپارتمان مسکونی و فضای اداری در عظیمیه.",
    content:
      "عظیمیه برای سرمایه‌گذارانی جذاب است که نقدشوندگی و تقاضای پایدار می‌خواهند. آپارتمان‌های خوش‌نقشه معمولاً اجارهٔ سریع‌تری دارند، اما دفاتر اداری منتخب می‌توانند بازده ماهانه بالاتری بسازند.\n\nقبل از خرید، هزینهٔ شارژ، پارکینگ مهمان و محدودیت‌های تغییر کاربری را بررسی کنید.\n\nافق نگهداری حداقل سه تا پنج ساله برای این منطقه منطقی‌تر از خرید و فروش کوتاه‌مدت است.",
    coverImage: "/images/admin/properties/mirdamad-office.jpg",
    category: "سرمایه‌گذاری",
    authorName: "کاوه مرادی",
    status: "published",
    publishedAt: "2026-03-22T08:15:00.000Z",
    readingTime: 7,
  },
  {
    id: "blog-4",
    title: "نبض بازار املاک کرج در بهار ۱۴۰۵",
    slug: "nabz-bazar-amlak-karaj-bahar-1405",
    excerpt:
      "مروری کوتاه بر تقاضای خرید، رفتار اجاره و فایل‌های آف‌مارکت در محله‌های بالاشهر کرج.",
    content:
      "در بهار ۱۴۰۵، تقاضای خرید در گوهردشت و عظیمیه پایدار مانده و بخشی از معاملات به فایل‌های خصوصی منتقل شده است. بازار اجاره همچنان حساس به قدرت خرید خانوار است.\n\nفایل‌های بازسازی‌شده با پارکینگ ثابت، سریع‌تر از واحدهای مشابه اما قدیمی به قرارداد می‌رسند.\n\nبرای تصمیم‌گیری دقیق‌تر، همیشه معاملات قطعی همان محله را ملاک بگذارید؛ نه فقط قیمت‌های پیشنهادی آگهی‌ها.",
    coverImage: "/images/admin/properties/jordan-renovated.jpg",
    category: "بازار املاک",
    authorName: "آرش شایگان",
    status: "published",
    publishedAt: "2026-03-28T14:00:00.000Z",
    readingTime: 4,
  },
  {
    id: "blog-5",
    title: "راهنمای زندگی در کمال‌شهر برای خریداران خانواده",
    slug: "rahnama-kamalshahr",
    excerpt:
      "مدارس، دسترسی بزرگراهی، بافت محله و نوع واحدهایی که برای خانواده در کمال‌شهر مناسب‌ترند.",
    content:
      "کمال‌شهر برای خانواده‌هایی که فضای بیشتر و دسترسی به جاده را می‌خواهند گزینهٔ قابل بررسی است. بافت محله ترکیبی از آپارتمان‌های نوساز و خانه‌های ویلایی است.\n\nقبل از خرید، مسیر مدرسه، ترافیک ساعت اوج و امکانات رفاهی اطراف را در ساعات مختلف روز ببینید.\n\nاگر بودجه محدود است، واحدهای خوش‌نقشه با نور جنوبی معمولاً ارزش نگهداری بهتری نسبت به متراژ خام دارند.",
    coverImage: "/images/admin/properties/saadatabad.jpg",
    category: "راهنمای محله‌ها",
    authorName: "سارا نوری",
    status: "published",
    publishedAt: "2026-04-02T10:45:00.000Z",
    readingTime: 6,
  },
  {
    id: "blog-6",
    title: "پنج اشتباه رایج هنگام فروش ملک لوکس",
    slug: "panj-eshtebah-foroosh-melk-lux",
    excerpt:
      "از قیمت‌گذاری احساسی تا ارائهٔ ناقص مدارک؛ اشتباهاتی که زمان فروش ملک فاخر را طولانی می‌کند.",
    content:
      "مالکان املاک لوکس گاهی با انتظار قیمتی بالاتر از عرف بازار، فایل را ماه‌ها معطل می‌گذارند. اشتباه بعدی، کمبود عکس و نبود تور بازدید ساختاریافته است.\n\nپنهان کردن ایرادات جزئی هم در بازدید دوم لو می‌رود و اعتماد را می‌شکند.\n\nهمراهی مشاور متخصص و آماده‌سازی حقوقی از روز اول، مسیر فروش را کوتاه‌تر و حرفه‌ای‌تر می‌کند.",
    coverImage: "/images/admin/properties/zaferanieh-penthouse.jpg",
    category: "فروش ملک",
    authorName: "کاوه مرادی",
    status: "draft",
    publishedAt: null,
    readingTime: 5,
  },
  {
    id: "blog-7",
    title: "اجاره یا خرید در فردیس؟ محاسبهٔ ساده برای سال جاری",
    slug: "ejare-ya-kharid-fardis",
    excerpt:
      "با یک مدل ساده هزینهٔ فرصت، ببینید برای شرایط شما در فردیس اجاره منطقی‌تر است یا خرید.",
    content:
      "انتخاب بین اجاره و خرید در فردیس به افق سکونت، پس‌انداز اولیه و تحمل نوسان قیمت بستگی دارد. اگر کمتر از سه سال در منطقه می‌مانید، اجاره اغلب انعطاف بیشتری می‌دهد.\n\nاگر افق بلندمدت دارید و هزینهٔ نگهداری برای‌تان قابل مدیریت است، خرید می‌تواند پوشش تورم مسکن باشد.\n\nعدد نهایی را با سناریوی افزایش اجاره سالانه و هزینهٔ تعمیرات مقایسه کنید، نه فقط با قسط فرضی.",
    coverImage: "/images/admin/properties/fereshteh-apt.jpg",
    category: "سرمایه‌گذاری",
    authorName: "آرش شایگان",
    status: "published",
    publishedAt: "2026-04-08T16:20:00.000Z",
    readingTime: 8,
  },
];
