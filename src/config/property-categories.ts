import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Fence,
  Landmark,
  Store,
  Trees,
  Warehouse,
} from "lucide-react";

export type PropertyCategoryId =
  | "residential"
  | "penthouse"
  | "villa"
  | "commercial"
  | "office"
  | "land";

export type CategoryFieldId =
  | "bedrooms"
  | "bathrooms"
  | "areaSqm"
  | "floor"
  | "parking"
  | "landArea"
  | "builtArea"
  | "units"
  | "frontage"
  | "landUse"
  | "waterAccess"
  | "powerAccess"
  | "terraceArea";

export type CategoryFieldDef = {
  id: CategoryFieldId;
  label: string;
  hint?: string;
  type: "number" | "text" | "select";
  options?: Array<{ value: string; label: string }>;
  /** Maps into core API numeric fields when present */
  mapsTo?: "bedrooms" | "bathrooms" | "areaSqm";
  optional?: boolean;
};

export type PropertyCategoryDef = {
  id: PropertyCategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  fields: CategoryFieldDef[];
  features: string[];
  defaults: Partial<Record<CategoryFieldId, string>>;
};

export const PROPERTY_CATEGORIES: PropertyCategoryDef[] = [
  {
    id: "residential",
    label: "آپارتمان",
    description: "واحد مسکونی در برج یا مجتمع",
    icon: Building2,
    defaults: { bedrooms: "2", bathrooms: "1", areaSqm: "110", floor: "3", parking: "1" },
    fields: [
      { id: "bedrooms", label: "تعداد خواب", type: "number", mapsTo: "bedrooms" },
      { id: "bathrooms", label: "سرویس بهداشتی", type: "number", mapsTo: "bathrooms" },
      { id: "areaSqm", label: "متراژ مفید (متر)", type: "number", mapsTo: "areaSqm" },
      { id: "floor", label: "طبقه", type: "number", optional: true },
      { id: "parking", label: "پارکینگ", type: "number", optional: true },
    ],
    features: ["آسانسور", "پارکینگ", "انباری", "بالکن", "نگهبانی", "لابی"],
  },
  {
    id: "penthouse",
    label: "پنت‌هاوس",
    description: "واحد دوبلکس یا آخر با تراس ویژه",
    icon: Landmark,
    defaults: { bedrooms: "3", bathrooms: "3", areaSqm: "280", terraceArea: "60", parking: "2" },
    fields: [
      { id: "bedrooms", label: "تعداد خواب", type: "number", mapsTo: "bedrooms" },
      { id: "bathrooms", label: "سرویس بهداشتی", type: "number", mapsTo: "bathrooms" },
      { id: "areaSqm", label: "متراژ واحد (متر)", type: "number", mapsTo: "areaSqm" },
      { id: "terraceArea", label: "متراژ تراس", type: "number", optional: true },
      { id: "parking", label: "پارکینگ", type: "number", optional: true },
    ],
    features: ["تراس پانوراما", "روف‌گاردن", "استخر", "جکوزی", "آسانسور اختصاصی", "نگهبانی ۲۴ ساعته"],
  },
  {
    id: "villa",
    label: "ویلا",
    description: "ویلای باغ‌دار یا دوبلکس مستقل",
    icon: Trees,
    defaults: { bedrooms: "4", bathrooms: "3", builtArea: "320", landArea: "800", parking: "2" },
    fields: [
      { id: "bedrooms", label: "تعداد خواب", type: "number", mapsTo: "bedrooms" },
      { id: "bathrooms", label: "سرویس بهداشتی", type: "number", mapsTo: "bathrooms" },
      { id: "builtArea", label: "زیربنا (متر)", type: "number", mapsTo: "areaSqm" },
      { id: "landArea", label: "متراژ زمین", type: "number", optional: true },
      { id: "parking", label: "پارکینگ", type: "number", optional: true },
    ],
    features: ["استخر", "باغ", "نگهبانی", "انشعابات کامل", "سند شش‌دانگ", "راه اختصاصی"],
  },
  {
    id: "commercial",
    label: "تجاری",
    description: "مغازه، پاساژ یا واحد تجاری",
    icon: Store,
    defaults: { units: "1", bathrooms: "1", areaSqm: "60", frontage: "6", parking: "0" },
    fields: [
      { id: "units", label: "تعداد واحد / دهنه", type: "number", mapsTo: "bedrooms" },
      { id: "bathrooms", label: "سرویس", type: "number", mapsTo: "bathrooms" },
      { id: "areaSqm", label: "متراژ (متر)", type: "number", mapsTo: "areaSqm" },
      { id: "frontage", label: "بر گذر (متر)", type: "number", optional: true },
      { id: "parking", label: "پارکینگ", type: "number", optional: true },
    ],
    features: ["بر اصلی", "انبار", "تهویه", "دوربین", "جواز کسب", "بالکن تجاری"],
  },
  {
    id: "office",
    label: "اداری",
    description: "دفتر کار یا واحد اداری",
    icon: Warehouse,
    defaults: { units: "3", bathrooms: "1", areaSqm: "140", floor: "5", parking: "2" },
    fields: [
      { id: "units", label: "تعداد اتاق", type: "number", mapsTo: "bedrooms" },
      { id: "bathrooms", label: "سرویس", type: "number", mapsTo: "bathrooms" },
      { id: "areaSqm", label: "متراژ (متر)", type: "number", mapsTo: "areaSqm" },
      { id: "floor", label: "طبقه", type: "number", optional: true },
      { id: "parking", label: "پارکینگ", type: "number", optional: true },
    ],
    features: ["آسانسور", "پارکینگ", "نگهبانی", "لابی", "سیستم اعلام حریق", "کابینت اداری"],
  },
  {
    id: "land",
    label: "زمین",
    description: "زمین کشاورزی، باغ یا قطعات شهری",
    icon: Fence,
    defaults: {
      areaSqm: "1000",
      landUse: "agricultural",
      waterAccess: "دارد",
      powerAccess: "دارد",
    },
    fields: [
      { id: "areaSqm", label: "متراژ زمین (متر)", type: "number", mapsTo: "areaSqm" },
      {
        id: "landUse",
        label: "کاربری",
        type: "select",
        options: [
          { value: "agricultural", label: "کشاورزی / زراعت" },
          { value: "garden", label: "باغ" },
          { value: "residential-plot", label: "مسکونی" },
          { value: "commercial-plot", label: "تجاری" },
          { value: "industrial", label: "صنعتی" },
        ],
      },
      { id: "waterAccess", label: "آب", type: "select", options: [
        { value: "دارد", label: "دارد" },
        { value: "ندارد", label: "ندارد" },
        { value: "چاه", label: "چاه" },
      ]},
      { id: "powerAccess", label: "برق", type: "select", options: [
        { value: "دارد", label: "دارد" },
        { value: "ندارد", label: "ندارد" },
      ]},
      { id: "frontage", label: "بر گذر (متر)", type: "number", optional: true },
    ],
    features: ["سند شش‌دانگ", "انشعاب آب", "انشعاب برق", "راه آسفالت", "دیوارکشی", "نزدیک به شهر"],
  },
];

export function getPropertyCategory(id: string): PropertyCategoryDef {
  return PROPERTY_CATEGORIES.find((c) => c.id === id) ?? PROPERTY_CATEGORIES[0];
}

/** Build API payload numbers + feature tags from category-specific draft values. */
export function mapCategoryFieldsToProperty(input: {
  category: string;
  values: Partial<Record<CategoryFieldId, string>>;
  selectedFeatures: string[];
}) {
  const cat = getPropertyCategory(input.category);
  let bedrooms = 0;
  let bathrooms = 0;
  let areaSqm = 0;
  const metaFeatures: string[] = [];

  for (const field of cat.fields) {
    const raw = input.values[field.id];
    if (raw == null || raw === "") continue;
    if (field.mapsTo === "bedrooms") bedrooms = Number(raw) || 0;
    else if (field.mapsTo === "bathrooms") bathrooms = Number(raw) || 0;
    else if (field.mapsTo === "areaSqm") areaSqm = Number(raw) || 0;
    else if (field.type === "select") {
      const opt = field.options?.find((o) => o.value === raw);
      metaFeatures.push(`${field.label}: ${opt?.label ?? raw}`);
    } else {
      metaFeatures.push(`${field.label}: ${raw}`);
    }
  }

  // Land / commercial should not imply residential bedrooms unless mapped.
  if (cat.id === "land") {
    bedrooms = 0;
    bathrooms = 0;
  }

  const features = Array.from(new Set([...input.selectedFeatures, ...metaFeatures]));
  return { bedrooms, bathrooms, areaSqm, features };
}
