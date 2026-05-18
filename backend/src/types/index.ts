import { Request } from "express";

export type Role = "admin" | "sales";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface JwtPayload {
  id: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}
