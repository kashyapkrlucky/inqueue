export const Spinner = ({ 
  theme = "light", 
  size = "md",
  className = ""
}: { 
  theme?: "light" | "dark"; 
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={`flex justify-center items-center ${className}`}> 
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-2 ${
        theme === "light" 
          ? "border-white/30 border-t-white" 
          : "border-gray-200 border-t-purple-600"
      }`}></div> 
    </div>
  );
};
