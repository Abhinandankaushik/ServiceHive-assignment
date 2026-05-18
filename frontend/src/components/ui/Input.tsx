import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => (
  <label className="block text-sm">
    {label && <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">{label}</span>}
    <input
      ref={ref}
      {...rest}
      className={clsx(
        "w-full rounded-lg border bg-white px-3 py-2 outline-none transition focus:ring-2 focus:ring-brand-500 dark:bg-slate-900",
        error ? "border-red-500" : "border-slate-300 dark:border-slate-700",
        className
      )}
    />
    {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
  </label>
));
Input.displayName = "Input";
