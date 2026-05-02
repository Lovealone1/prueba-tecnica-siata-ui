import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/hooks/useTheme";

export function NotifierProvider() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface-container-lowest group-[.toaster]:text-on-surface group-[.toaster]:border-outline-variant/20 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:font-inter",
          description: "group-[.toast]:text-on-surface-variant group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-on-primary group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-surface-container-high group-[.toast]:text-on-surface",
          success: "group-[.toast]:text-primary group-[.toast]:border-primary/20",
          error: "group-[.toast]:text-error group-[.toast]:border-error/20",
        },
      }}
      richColors
      position="top-right"
      closeButton
    />
  );
}
