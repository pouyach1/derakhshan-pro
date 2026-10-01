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
  status: "فروخته‌شد" | "اجاره داده شد";
  image: string;
};

export type Law = {
  statement: string;
};

export type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  categories: Array<"مسکونی لوکس" | "ویلا و باغ" | "اداری" | "تجاری و مختلط">;
  message?: string;
};
