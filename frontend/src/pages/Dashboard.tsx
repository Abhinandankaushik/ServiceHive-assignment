import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, Plus, Search } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { LeadForm } from "../components/leads/LeadForm";
import { LeadTable } from "../components/leads/LeadTable";
import { Pagination } from "../components/leads/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import {
  createLeadApi, deleteLeadApi, exportCsvApi, listLeadsApi, updateLeadApi,
} from "../api/leads";
import { Lead, LeadSource, LeadStatus, PageMeta } from "../types";

const emptyMeta: PageMeta = { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false };

export const Dashboard = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PageMeta>(emptyMeta);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<LeadStatus | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState<number>(1);

  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data, meta } = await listLeadsApi({
        status: status || undefined, source: source || undefined,
        search: debouncedSearch || undefined, sort, page, limit: 10,
      });
      setLeads(data); setMeta(meta);
    } catch (e) {
      setError((e as Error).message); toast.error("Failed to load leads");
    } finally { setLoading(false); }
  }, [status, source, debouncedSearch, sort, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setPage(1); }, [status, source, debouncedSearch, sort]);

  const onSubmit = async (values: { name: string; email: string; status: LeadStatus; source: LeadSource }) => {
    try {
      if (editing) {
        await updateLeadApi(editing._id, values);
        toast.success("Lead updated");
      } else {
        await createLeadApi(values);
        toast.success("Lead created");
      }
      setModalOpen(false); setEditing(null); fetchLeads();
    } catch (e) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Save failed");
    }
  };

  const onDelete = async (l: Lead) => {
    if (!window.confirm(`Delete lead "${l.name}"?`)) return;
    try { await deleteLeadApi(l._id); toast.success("Deleted"); fetchLeads(); }
    catch { toast.error("Delete failed (admin only)"); }
  };

  const onExport = async () => {
    try {
      const blob = await exportCsvApi({
        status: status || undefined, source: source || undefined,
        search: debouncedSearch || undefined, sort,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `leads-${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Export failed"); }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Leads</h2>
            <p className="text-sm text-slate-500">Manage, filter and export your leads.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onExport}><Download className="h-4 w-4" /> Export CSV</Button>
            <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> New Lead</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-9 h-4 w-4 text-slate-400" />
              <Input label="Search" placeholder="Name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | "")}>
              <option value="">All</option>
              {(["New","Contacted","Qualified","Lost"] as LeadStatus[]).map((s) => <option key={s}>{s}</option>)}
            </Select>
            <Select label="Source" value={source} onChange={(e) => setSource(e.target.value as LeadSource | "")}>
              <option value="">All</option>
              {(["Website","Instagram","Referral"] as LeadSource[]).map((s) => <option key={s}>{s}</option>)}
            </Select>
            <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value as "latest" | "oldest")}>
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </Select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error ? (
            <div className="p-8 text-center">
              <p className="font-medium text-red-600">Something went wrong</p>
              <p className="text-sm text-slate-500">{error}</p>
              <Button className="mt-3" onClick={fetchLeads}>Retry</Button>
            </div>
          ) : (
            <>
              <LeadTable
                leads={leads}
                loading={loading}
                canDelete={user?.role === "admin"}
                onEdit={(l) => { setEditing(l); setModalOpen(true); }}
                onDelete={onDelete}
              />
              {!loading && leads.length > 0 && <Pagination meta={meta} onPage={setPage} />}
            </>
          )}
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "Edit Lead" : "New Lead"}>
        <LeadForm initial={editing} onSubmit={onSubmit} onCancel={() => { setModalOpen(false); setEditing(null); }} />
      </Modal>
    </div>
  );
};
