import { PageMeta } from "../../types";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props { meta: PageMeta; onPage: (page: number) => void }

export const Pagination = ({ meta, onPage }: Props) => (
  <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
    <div className="text-slate-600 dark:text-slate-400">
      Page <span className="font-semibold">{meta.page}</span> of <span className="font-semibold">{meta.totalPages}</span> · {meta.total} leads
    </div>
    <div className="flex gap-2">
      <Button variant="outline" disabled={!meta.hasPrev} onClick={() => onPage(meta.page - 1)}>
        <ChevronLeft className="h-4 w-4" /> Prev
      </Button>
      <Button variant="outline" disabled={!meta.hasNext} onClick={() => onPage(meta.page + 1)}>
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
