import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost" | "danger" | "outline";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

const styles: Record<Variant, string> = {
  primary: "bg-brand-600 hover:bg-brand-700 text-white",
  ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  outline: "border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800",
};

export const Button = ({ variant = "primary", loading, className, children, disabled, ...rest }: Props) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed",
      styles[variant],
      className
    )}
  >
    {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
    {children}
  </button>
);
