import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { BarChart3 } from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState<string>("admin@demo.com");
  const [password, setPassword] = useState<string>("admin123");
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); toast.success("Welcome back!"); nav("/"); }
    catch (err) { toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white"><BarChart3 className="h-6 w-6" /></div>
          <div>
            <h1 className="text-xl font-bold">Smart Leads</h1>
            <p className="text-sm text-slate-500">Sign in to your dashboard</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          No account? <Link to="/register" className="text-brand-600 hover:underline">Create one</Link>
        </p>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <p><b>Admin:</b> admin@demo.com / admin123</p>
          <p><b>Sales:</b> sales@demo.com / sales123</p>
        </div>
      </div>
    </div>
  );
};
