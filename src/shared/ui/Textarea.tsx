import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  label?: string;
  boxClassName?: string;
  description?: string;
}

export default function Textarea({
  id,
  label,
  boxClassName = "flex flex-col gap-2",
  description,
  ...props
}: TextareaProps) {
  return (
    <div className={boxClassName}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      <div className="w-full flex items-center gap-2 rounded-xl border border-gray-200 bg-white focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
        <textarea
          id={id}
          rows={3}
          className="h-full w-full p-3 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          {...props}
        />
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
