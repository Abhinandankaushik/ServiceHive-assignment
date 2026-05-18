import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";

export const Register = () => {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "sales">("sales");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await register(name, email, password, role); toast.success("Account created!"); nav("/"); }
    catch (err) { toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Register failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-6 text-xl font-bold">Create your account</h1>
        <form className="space-y-4" onSubmit={submit}>
          <Input label="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as "admin" | "sales")}>
            <option value="sales">Sales User</option>
            <option value="admin">Admin</option>
          </Select>
          <Button type="submit" className="w-full" loading={loading}>Create account</Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Have an account? <Link to="/login" className="text-brand-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
