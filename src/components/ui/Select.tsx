interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  className?: string;
  label?: string;
  id?: string;
  boxClassName?: string;
}

export default function Select({
  children,
  boxClassName = "flex flex-col gap-2",
  label,
  id,
  ...props
}: SelectProps) {
  return (
    <div className={boxClassName}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          {label}
        </label>
      )}
      <div className="w-full flex items-center gap-2 rounded-xl border border-gray-200 bg-white focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
        <select
          id={id}
          className="h-full w-full p-3 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
}
