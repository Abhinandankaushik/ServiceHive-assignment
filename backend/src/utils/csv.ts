type CsvLead = {
  name?: string;
  email?: string;
  status?: string;
  source?: string;
  createdAt?: Date | string;
};

const escape = (val: unknown): string => {
  const s = String(val ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export const leadsToCsv = (leads: CsvLead[]): string => {
  const headers = ["Name", "Email", "Status", "Source", "Created At"];
  const rows = leads.map((l) =>
    [l.name, l.email, l.status, l.source, l.createdAt?.toString()].map(escape).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};
