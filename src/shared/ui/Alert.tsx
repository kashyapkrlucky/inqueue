export const Alert = ({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "warning" | "success" | "info";
  className?: string;
}) => {
  return (
    <div
      className={`alert ${variant === "destructive" ? "alert-error" : variant === "warning" ? "alert-warning" : variant === "success" ? "alert-success" : variant === "info" ? "alert-info" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`alert-title ${className}`}>{children}</div>;
};
export const AlertDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`alert-description ${className}`}>{children}</div>;
};
