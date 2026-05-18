import api from "./axios";
import { ApiResponse, Lead, LeadFilters, PageMeta } from "../types";

const buildParams = (f: LeadFilters): Record<string, string> => {
  const p: Record<string, string> = {};
  if (f.status) p.status = f.status;
  if (f.source) p.source = f.source;
  if (f.search) p.search = f.search;
  if (f.sort) p.sort = f.sort;
  if (f.page) p.page = String(f.page);
  if (f.limit) p.limit = String(f.limit);
  return p;
};

export const listLeadsApi = async (filters: LeadFilters): Promise<{ data: Lead[]; meta: PageMeta }> => {
  const { data } = await api.get<ApiResponse<Lead[]>>("/leads", { params: buildParams(filters) });
  return { data: data.data, meta: data.meta as PageMeta };
};

export const createLeadApi = async (payload: Omit<Lead, "_id" | "owner" | "createdAt" | "updatedAt">) => {
  const { data } = await api.post<ApiResponse<Lead>>("/leads", payload);
  return data.data;
};

export const updateLeadApi = async (id: string, payload: Partial<Lead>) => {
  const { data } = await api.patch<ApiResponse<Lead>>(`/leads/${id}`, payload);
  return data.data;
};

export const deleteLeadApi = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportCsvApi = async (filters: LeadFilters): Promise<Blob> => {
  const res = await api.get("/leads/export", { params: buildParams(filters), responseType: "blob" });
  return res.data as Blob;
};
