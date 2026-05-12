export const Button = ({
  type = "button",
  children,
  variant,
  className,
  size,
  onClick,
  disabled,
}: {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "warning"
    | "success"
    | "info"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  size?: "default" | "xs" | "sm" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}) => {

  const sizeClasses = {
    xs: "text-xs px-2 py-1",
    sm: "text-sm px-3 py-1.5",
    lg: "text-lg px-6 py-3",
    default: "text-base px-5 py-2.5"
  };
  return (
    <button
      type={type}
      className={`rounded-xl inline-flex items-center gap-2 font-semibold cursor-pointer justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
        variant === "destructive"
          ? "bg-red-500 text-white hover:bg-red-600"
          : variant === "warning"
          ? "bg-yellow-500 text-white hover:bg-yellow-600"
          : variant === "success"
          ? "bg-emerald-500 text-white hover:bg-emerald-600"
          : variant === "info"
          ? "bg-indigo-500 hover:bg-indigo-600"
          : variant === "outline"
          ? "text-gray-600 border border-gray-600 hover:bg-gray-100"
          : variant === "secondary"
          ? "bg-gray-500 hover:bg-gray-600"
          : variant === "ghost"
          ? "bg-transparent hover:bg-gray-100"
          : variant === "link"
          ? "bg-transparent hover:bg-gray-100"
          : "bg-gray-900 text-white"
      } ${className} ${sizeClasses[size || "default"]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
