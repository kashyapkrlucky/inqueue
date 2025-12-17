import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  icon?: React.ReactNode;
  label?: string;
  boxClassName?: string;
  inputClasses?: string;
}

export default function Input({
  id,
  label,
  boxClassName,
  inputClasses, 
  icon,
  ...props
}: InputProps) {
  return (
    <div className={boxClassName}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1 relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon || null}
          </div>
        )}
        <input
          id={id}
          type="text"
          className={`block w-full rounded-lg text-gray-700 dark:text-gray-700 border-gray-300 shadow-xs border-2 focus:outline-none focus:border-blue-500 text-sm py-2 px-3 ${inputClasses}`}
          {...props}
        />
      </div>
    </div>
  );
}
