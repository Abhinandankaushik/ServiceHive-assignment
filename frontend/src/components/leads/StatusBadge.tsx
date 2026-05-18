import clsx from "clsx";
import { LeadStatus } from "../../types";

const map: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Contacted: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Qualified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Lost: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", map[status])}>{status}</span>
);
