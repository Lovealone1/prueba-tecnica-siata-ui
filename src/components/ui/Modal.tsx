import { type ReactNode, useEffect } from "react";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const MAX_WIDTHS = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "2xl": "max-w-7xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md"
}: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={cn(
        "relative w-full bg-background border border-outline-variant/30 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col h-auto max-h-[90vh]",
        MAX_WIDTHS[maxWidth]
      )}>
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-manrope font-black text-on-surface tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-on-surface-variant text-sm font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 text-outline hover:text-primary transition-all"
          >
            <Icon name="close" size="xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow px-8 pb-4 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
