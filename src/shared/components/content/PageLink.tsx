import { Link } from "react-router-dom";
import { cn } from "../../utils";

interface PageLinkProps {
  url: string;
  text: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
}

export default function PageLink({ 
  url, 
  text, 
  size = "sm", 
  className,
  external = false 
}: PageLinkProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const classes = cn(
    "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 visited:text-purple-600 dark:visited:text-purple-400 transition-colors duration-200",
    sizeClasses[size],
    className
  );

  if (external) {
    return (
      <a 
        href={url} 
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }

  return (
    <Link to={url} className={classes}>
      {text}
    </Link>
  );
}
