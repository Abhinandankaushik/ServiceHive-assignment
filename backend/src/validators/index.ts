import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
  role: z.enum(["admin", "sales"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const leadCreateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]).optional(),
  source: z.enum(["Website", "Instagram", "Referral"]),
});

export const leadUpdateSchema = leadCreateSchema.partial();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
