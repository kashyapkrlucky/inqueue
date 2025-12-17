export const Button = ({
  children,
  variant,
  className,
  size,
  onClick,
  disabled,
}: {
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
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`px-5 py-2.5 rounded-xl inline-flex items-center justify-center ${
        variant === "destructive"
          ? "bg-red-500 hover:bg-red-600"
          : variant === "warning"
          ? "bg-yellow-500 hover:bg-yellow-600"
          : variant === "success"
          ? "bg-green-500 hover:bg-green-600"
          : variant === "info"
          ? "bg-blue-500 hover:bg-blue-600"
          : variant === "outline"
          ? "text-gray-200 border border-gray-300 hover:bg-gray-600"
          : variant === "secondary"
          ? "bg-gray-500 hover:bg-gray-600"
          : variant === "ghost"
          ? "bg-transparent hover:bg-gray-100"
          : variant === "link"
          ? "bg-transparent hover:bg-gray-100"
          : "bg-blue-500 hover:bg-blue-600"
      } ${className} ${size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
