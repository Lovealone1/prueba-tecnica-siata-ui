import { Component, type ErrorInfo, type ReactNode } from "react";
import { Icon } from "@/utils/icon";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-error/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
            <Icon name="error" size="2xl" className="text-error" />
          </div>

          <h1 className="text-3xl font-manrope font-black text-on-surface tracking-tight mb-4">
            Algo no salió como esperábamos
          </h1>

          <p className="text-on-surface-variant max-w-md mx-auto mb-10 font-medium">
            Se ha producido un error inesperado en la aplicación. Hemos notificado al equipo técnico.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-error text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-error/90 active:scale-[0.98] transition-all shadow-xl shadow-error/20"
            >
              <Icon name="refresh" size="sm" />
              <span>Recargar Aplicación</span>
            </button>

            <a
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-surface-container-high text-on-surface font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-surface-container-highest active:scale-[0.98] transition-all"
            >
              <Icon name="home" size="sm" />
              <span>Volver al Inicio</span>
            </a>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-6 bg-surface-container-lowest border border-error/20 rounded-2xl text-left max-w-2xl w-full overflow-auto">
              <p className="text-error font-mono text-xs mb-2">Error Detail (Dev Only):</p>
              <pre className="text-[10px] text-on-surface-variant font-mono">
                {this.state.error?.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
