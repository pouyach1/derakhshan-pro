export type Persona = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type Deal = {
  id: string;
  area: string;
  size?: string;
  title: string;
  status: "فروخته‌شده" | "اجاره‌داده‌شده";
  image: string;
};

export type Law = {
  statement: string;
};

export type ContactInterest =
  | "اجاره فضای لوکس"
  | "خرید ملک VIP"
  | "فروش یا معرفی دارایی"
  | "مشاوره استراتژیک سرمایه‌گذاری";

export type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  interest: ContactInterest | "";
  categories: Array<"مسکونی لوکس" | "ویلا و باغ" | "اداری" | "تجاری و مختلط">;
  message?: string;
};
