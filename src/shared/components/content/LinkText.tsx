import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils";

interface LinkTextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "primary" | "secondary" | "muted" | "accent";
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold";
  underline?: "none" | "hover" | "always";
  children: React.ReactNode;
  external?: boolean;
}

const variantClasses = {
  primary: "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 visited:text-purple-600 dark:visited:text-purple-400",
  secondary: "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
  muted: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
  accent: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300",
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
};

const underlineClasses = {
  none: "",
  hover: "hover:underline",
  always: "underline",
};

export default function LinkText({
  href,
  variant = "primary",
  size = "md",
  weight = "normal",
  underline = "hover",
  className,
  children,
  external = false,
  ...props
}: LinkTextProps) {
  const classes = cn(
    "transition-colors duration-200",
    variantClasses[variant],
    sizeClasses[size],
    weightClasses[weight],
    underlineClasses[underline],
    className
  );

  const linkProps = {
    className: classes,
    href,
    ...props,
  };

  if (external) {
    return (
      <a {...linkProps} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link to={href} {...(linkProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</Link>;
}
