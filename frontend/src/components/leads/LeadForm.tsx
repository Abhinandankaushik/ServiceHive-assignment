import { useEffect, useState, FormEvent } from "react";
import { Lead, LeadSource, LeadStatus } from "../../types";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

interface Props {
  initial?: Lead | null;
  onSubmit: (values: { name: string; email: string; status: LeadStatus; source: LeadSource }) => Promise<void>;
  onCancel: () => void;
}

interface Errors { name?: string; email?: string }

export const LeadForm = ({ initial, onSubmit, onCancel }: Props) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<LeadStatus>("New");
  const [source, setSource] = useState<LeadSource>("Website");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setStatus(initial?.status ?? "New");
    setSource(initial?.source ?? "Website");
    setErrors({});
  }, [initial]);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try { await onSubmit({ name: name.trim(), email: email.trim(), status, source }); }
    finally { setSubmitting(false); }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
        {(["New","Contacted","Qualified","Lost"] as LeadStatus[]).map((s) => <option key={s}>{s}</option>)}
      </Select>
      <Select label="Source" value={source} onChange={(e) => setSource(e.target.value as LeadSource)}>
        {(["Website","Instagram","Referral"] as LeadSource[]).map((s) => <option key={s}>{s}</option>)}
      </Select>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>{initial ? "Update" : "Create"} Lead</Button>
      </div>
    </form>
  );
};
