import { useTheme } from "@/components/ui/theme-provider"
import { Moon, Sun } from "lucide-react"

function App() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="max-w-md w-full p-8 space-y-8 text-center bg-card rounded-xl shadow-lg border border-border">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Prueba Técnica SIATA
        </h1>
        <p className="text-muted-foreground">
          El tema actual es: <span className="font-mono font-bold uppercase">{theme}</span>
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${theme === "light"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-accent border-input"
              }`}
          >
            <Sun size={18} />
            Claro
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${theme === "dark"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-accent border-input"
              }`}
          >
            <Moon size={18} />
            Oscuro
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`px-4 py-2 rounded-md border transition-all ${theme === "system"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-accent border-input"
              }`}
          >
            Sistema
          </button>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Este es un ejemplo de integración con shadcn y Tailwind CSS v4.
            El color principal (primary) está configurado como #1b73cd.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
