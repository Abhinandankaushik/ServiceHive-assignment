import { Response } from "express";
import asyncHandler from "express-async-handler";
import { Lead } from "../models/Lead";
import { ApiError } from "../middleware/error";
import { AuthRequest, LeadSource, LeadStatus } from "../types";
import { leadsToCsv } from "../utils/csv";
import { FilterQuery } from "mongoose";
import type { ILead } from "../models/Lead";

interface ListQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: "latest" | "oldest";
  page?: string;
  limit?: string;
}

const buildFilter = (q: ListQuery, ownerId: string, role: string): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};
  if (role !== "admin") filter.owner = ownerId;
  if (q.status) filter.status = q.status;
  if (q.source) filter.source = q.source;
  if (q.search) {
    const regex = new RegExp(q.search.trim(), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }
  return filter;
};

export const listLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError("Unauthorized", 401);
  const q = req.query as ListQuery;
  const page = Math.max(1, parseInt(q.page ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(q.limit ?? "10", 10)));
  const skip = (page - 1) * limit;
  const sort: 1 | -1 = q.sort === "oldest" ? 1 : -1;

  const filter = buildFilter(q, req.user.id, req.user.role);

  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sort }).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: skip + items.length < total,
      hasPrev: page > 1,
    },
  });
});

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError("Unauthorized", 401);
  const lead = await Lead.create({ ...req.body, owner: req.user.id });
  res.status(201).json({ success: true, data: lead });
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError("Unauthorized", 401);
  const filter: FilterQuery<ILead> = { _id: req.params.id };
  if (req.user.role !== "admin") filter.owner = req.user.id;
  const lead = await Lead.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
  if (!lead) throw new ApiError("Lead not found", 404);
  res.json({ success: true, data: lead });
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError("Unauthorized", 401);
  const filter: FilterQuery<ILead> = { _id: req.params.id };
  if (req.user.role !== "admin") filter.owner = req.user.id;
  const lead = await Lead.findOneAndDelete(filter);
  if (!lead) throw new ApiError("Lead not found", 404);
  res.json({ success: true, message: "Lead deleted" });
});

export const exportCsv = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError("Unauthorized", 401);
  const filter = buildFilter(req.query as ListQuery, req.user.id, req.user.role);
  const items = await Lead.find(filter).sort({ createdAt: -1 }).lean();
  const csv = leadsToCsv(items);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="leads-${Date.now()}.csv"`);
  res.send(csv);
});
