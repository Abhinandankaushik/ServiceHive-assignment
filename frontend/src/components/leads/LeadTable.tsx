import { Lead } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
  leads: Lead[];
  loading: boolean;
  canDelete: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadTable = ({ leads, loading, canDelete, onEdit, onDelete }: Props) => {
  if (loading) {
    return (
      <div className="space-y-2 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    );
  }
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
        <p className="text-lg font-semibold">No leads found</p>
        <p className="text-sm text-slate-500">Try adjusting your filters or create a new lead.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {leads.map((l) => (
            <tr key={l._id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
              <td className="px-4 py-3 font-medium">{l.name}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{l.email}</td>
              <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
              <td className="px-4 py-3">{l.source}</td>
              <td className="px-4 py-3 text-slate-500">{new Date(l.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" onClick={() => onEdit(l)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                  {canDelete && (
                    <Button variant="ghost" onClick={() => onDelete(l)} aria-label="Delete" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
