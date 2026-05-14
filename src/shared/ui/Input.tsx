import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  icon?: React.ReactNode;
  label?: string;
  boxClassName?: string;
  className?: string;
}

export default function Input({
  id,
  label,
  boxClassName = "flex flex-col gap-2",
  className,
  icon,
  ...props
}: InputProps) {
  return (
    <div className={`relative ${boxClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      <div className="w-full flex items-center gap-2 rounded-xl border border-gray-200 bg-white focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon || null}
          </div>
        )}
        <input
          id={id}
          type="text"
          className={`${icon ? "pl-10" : ""} h-full w-full p-3 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
