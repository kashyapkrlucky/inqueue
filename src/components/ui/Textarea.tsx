import type { InputHTMLAttributes } from "react";

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  label?: string;
  boxClassName?: string;
  description?: string;
}

export default function Textarea({
  id,
  label,
  boxClassName,
  description,
  ...props
}: TextareaProps) {
  return (
    <div className={boxClassName}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1">
        <textarea
          id={id}
          rows={3}
          className="block w-full rounded-lg text-gray-700 dark:text-gray-700 border-gray-300 shadow-xs border-2 focus:outline-none focus:border-blue-500 text-sm py-2 px-3"
          {...props}
        />
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
