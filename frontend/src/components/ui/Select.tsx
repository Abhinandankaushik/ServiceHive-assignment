import { SelectHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export const Select = ({ label, className, children, ...rest }: Props) => (
  <label className="block text-sm">
    {label && <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">{label}</span>}
    <select
      {...rest}
      className={clsx(
        "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900",
        className
      )}
    >
      {children}
    </select>
  </label>
);
