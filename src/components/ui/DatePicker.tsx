import { useState, useRef, useEffect } from "react";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  direction?: "up" | "down";
}

export function DatePicker({ label, value, onChange, placeholder = "Seleccionar fecha...", icon = "event", direction = "down" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safe parsing of the value string to avoid timezone issues
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      return parseISO(value);
    }
    return new Date();
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-2 border-b border-outline-variant/10">
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); setCurrentMonth(subMonths(currentMonth, 1)); }}
          className="p-1 hover:bg-outline-variant/10 rounded-lg transition-colors"
        >
          <Icon name="chevron_left" size="sm" />
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-on-surface">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </span>
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); setCurrentMonth(addMonths(currentMonth, 1)); }}
          className="p-1 hover:bg-outline-variant/10 rounded-lg transition-colors"
        >
          <Icon name="chevron_right" size="sm" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const date = ["D", "L", "M", "M", "J", "V", "S"];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-[10px] font-black text-outline uppercase py-2">
          {date[i]}
        </div>
      );
    }
    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isSelected = value ? isSameDay(day, parseISO(value)) : false;
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "h-8 flex items-center justify-center text-xs cursor-pointer transition-all rounded-lg m-0.5",
              !isCurrentMonth ? "text-outline/20" : isSelected ? "bg-primary text-white font-bold shadow-lg shadow-primary/30" : "text-on-surface hover:bg-primary/10",
              isSameDay(day, new Date()) && !isSelected && "border border-primary/30 text-primary font-bold"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onChange(format(cloneDay, "yyyy-MM-dd"));
              setIsOpen(false);
            }}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="p-2">{rows}</div>;
  };

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-widest text-outline px-1">{label}</label>
      <div 
        onClick={toggleOpen}
        className={cn(
          "relative group cursor-pointer w-full pl-12 pr-4 py-3 bg-surface-container-low border rounded-2xl text-xs transition-all flex items-center h-[46px]",
          isOpen ? "border-primary shadow-lg shadow-primary/5 bg-surface-container-lowest" : "border-outline-variant/30 hover:border-outline-variant/60"
        )}
      >
        <Icon name={icon} className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", isOpen ? "text-primary" : "text-outline group-hover:text-primary")} />
        <span className={cn(
          "font-bold transition-all",
          value ? "text-on-surface" : "text-outline/50"
        )}>
          {value ? format(parseISO(value), "dd 'de' MMMM, yyyy", { locale: es }) : placeholder}
        </span>
        <Icon name="calendar_today" size="xs" className="absolute right-4 text-outline/30" />
      </div>

      {isOpen && (
        <div className={cn(
          "absolute left-0 w-64 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-[100] animate-in fade-in duration-200",
          direction === "up" 
            ? "bottom-[calc(100%+8px)] slide-in-from-bottom-2 origin-bottom" 
            : "top-[calc(100%+8px)] slide-in-from-top-2 origin-top"
        )}>
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          {value && (
            <div className="p-2 border-t border-outline-variant/10">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                  setIsOpen(false);
                }}
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-error hover:bg-error/5 rounded-lg transition-all"
              >
                Limpiar fecha
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
