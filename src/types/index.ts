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
  status: "Sold" | "Leased";
  image: string;
};

export type Law = {
  statement: string;
};

export type ContactInterest =
  | "To lease a space"
  | "To buy a property"
  | "To list an asset"
  | "For strategic advisory";

export type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  interest: ContactInterest | "";
  categories: Array<"Retail" | "Industrial" | "Office" | "Mixed-Use">;
  message?: string;
};
