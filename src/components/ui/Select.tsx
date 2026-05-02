import { useState, useRef, useEffect } from "react";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  icon?: string;
  className?: string;
  direction?: "up" | "down";
  size?: "default" | "sm";
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  label,
  icon,
  className,
  direction = "down",
  size = "default",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-1.5 w-full relative", className)} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between pl-12 pr-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm transition-all outline-none",
            size === "sm" ? "py-2 pl-10" : "py-3",
            isOpen ? "border-primary ring-4 ring-primary/5" : "hover:border-outline-variant/60"
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {icon && (
              <Icon 
                name={selectedOption?.icon || icon} 
                size={size === "sm" ? "xs" : "sm"}
                className={cn(
                  "absolute transition-colors",
                  size === "sm" ? "left-3.5" : "left-4",
                  "top-1/2 -translate-y-1/2",
                  isOpen || value ? "text-primary" : "text-outline"
                )} 
              />
            )}
            <span className={cn(
              "truncate font-medium",
              !value ? "text-outline/70" : "text-on-surface"
            )}>
              {selectedOption?.label || placeholder}
            </span>
          </div>
          
          <Icon 
            name="expand_more" 
            className={cn(
              "text-outline transition-transform duration-300",
              isOpen && "rotate-180 text-primary"
            )} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className={cn(
            "absolute left-0 w-full bg-background border border-outline-variant/20 rounded-2xl shadow-2xl z-[110] py-2 animate-in fade-in duration-200",
            direction === "up" 
              ? "bottom-[calc(100%+4px)] slide-in-from-bottom-2" 
              : "top-[calc(100%+4px)] slide-in-from-top-2"
          )}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all",
                  value === option.value 
                    ? "bg-primary text-white font-bold" 
                    : "text-on-surface hover:bg-primary/10 hover:text-primary"
                )}
              >
                {option.icon && <Icon name={option.icon} size="sm" />}
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <Icon name="check" size="sm" className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
