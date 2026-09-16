import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(3, "شناسه ورود نامعتبر است"),
  secret: z.string().min(1, "رمز یا کد تأیید الزامی است"),
});

export const otpRequestSchema = z.object({
  phone: z.string().min(10, "شماره موبایل نامعتبر است"),
});

export const onboardingSchema = z.object({
  fullName: z.string().min(2),
  intent: z.enum(["buy", "rent", "invest"]),
  neighborhoods: z.array(z.string()).default([]),
  budgetMin: z.number().nonnegative(),
  budgetMax: z.number().nonnegative(),
  areaMin: z.number().nonnegative().default(0),
  areaMax: z.number().nonnegative().default(0),
  bedrooms: z.number().int().nonnegative().default(0),
  hasElevator: z.boolean().default(false),
  hasParking: z.boolean().default(false),
});

export const propertyCreateSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  neighborhood: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive(),
  listingType: z.enum(["sale", "rent"]).default("sale"),
  category: z.string().default("residential"),
  status: z
    .enum(["draft", "published", "negotiation", "sold", "archived"])
    .default("draft"),
  bedrooms: z.number().int().nonnegative().default(0),
  bathrooms: z.number().int().nonnegative().default(0),
  areaSqm: z.number().nonnegative().default(0),
  features: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  agentId: z.string().optional(),
  isFeatured: z.boolean().optional(),
  code: z.string().optional(),
});

export const propertyUpdateSchema = propertyCreateSchema.partial().extend({
  version: z.number().int().positive().optional(),
});

export const propertyQuerySchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  listingType: z.string().optional(),
  agentId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  featured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const leadCreateSchema = z.object({
  clientName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  assignedAgentId: z.string().optional(),
});

export const leadUpdateSchema = z.object({
  status: z
    .enum(["new", "contacted", "viewing", "negotiation", "closed", "lost"])
    .optional(),
  notes: z.string().optional(),
  assignedAgentId: z.string().optional(),
  propertyTitle: z.string().optional(),
});

export const clientCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  preferredNeighborhood: z.string().optional(),
  budgetMin: z.number().nonnegative().default(0),
  budgetMax: z.number().nonnegative().default(0),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
  intent: z.enum(["buy", "rent", "invest"]).default("buy"),
  notes: z.array(z.object({ text: z.string(), at: z.string().optional() })).optional(),
});

export const tourCreateSchema = z.object({
  propertyId: z.string().min(1),
  clientName: z.string().min(2),
  clientPhone: z.string().optional(),
  scheduledAt: z.string().min(4),
  dayLabel: z.string().optional(),
  timeLabel: z.string().optional(),
  notes: z.string().optional(),
});

export const tourUpdateSchema = z.object({
  status: z.enum(["upcoming", "completed", "canceled"]).optional(),
  notes: z.string().optional(),
  scheduledAt: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  interest: z.string().optional(),
  category: z.string().optional(),
  message: z.string().min(2),
  budget: z.string().optional(),
  tab: z.enum(["vip", "appraisal", "legal", "home", "newsletter"]).default("home"),
});
