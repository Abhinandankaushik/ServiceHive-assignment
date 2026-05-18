import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { LogOut, Moon, Sun, BarChart3 } from "lucide-react";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold">Smart Leads</h1>
            <p className="text-xs text-slate-500">Lead Management Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user.role}</div>
            </div>
          )}
          <Button variant="outline" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user && (
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
