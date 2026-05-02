import { useState, useRef, useEffect, useMemo } from "react";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  icon?: string;
  className?: string;
  direction?: "up" | "down";
  size?: "default" | "sm";
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  label,
  icon,
  className,
  direction = "down",
  size = "default",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter((opt) => 
      opt.label.toLowerCase().includes(lowerSearch) || 
      opt.value.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

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
            "absolute left-0 w-full bg-background border border-outline-variant/20 rounded-2xl shadow-2xl z-[110] py-2 animate-in fade-in duration-200 overflow-hidden flex flex-col",
            direction === "up" 
              ? "bottom-[calc(100%+4px)] slide-in-from-bottom-2" 
              : "top-[calc(100%+4px)] slide-in-from-top-2"
          )}>
            <div className="px-3 py-2 border-b border-outline-variant/10">
              <div className="relative">
                <Icon name="search" size="xs" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all text-left",
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
                ))
              ) : (
                <div className="px-4 py-6 text-center text-outline text-xs italic">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
