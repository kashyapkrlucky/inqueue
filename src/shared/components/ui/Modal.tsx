import React from "react";
import { XIcon } from "lucide-react";

interface ModalProps {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  icon,
  footer,
  size = "md",
}: ModalProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen || !isMounted) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, isOpen, isMounted]);

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full ${sizeClasses[size]} h-auto border border-gray-200 dark:border-gray-700`}>
        <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="inline-flex items-center gap-3">
              {icon && <div className="inline-block">{icon}</div>}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            </div>
            <button 
              onClick={onClose} 
              className="inline-block p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </header>
        <section className="px-6 py-4 overflow-y-auto">{children}</section>
        {footer && (
          <footer className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
