import { Link } from "react-router-dom";
import { Icon } from "@/utils/icon";

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary/80 mb-4">
      <span className="w-4 h-[2px] bg-primary/60 rounded-full" />
      {children}
    </p>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant/25 rounded-3xl ${className}`}>
      {children}
    </div>
  );
}

function DetailList({ items, icon = "check_circle" }: { items: string[], icon?: string }) {
  return (
    <ul className="space-y-3 mt-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <Icon name={icon} size="sm" className="text-primary/70 shrink-0 mt-0.5" />
          <span className="text-sm text-on-surface-variant leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ModuleCard({ title, icon, desc, features }: { title: string; icon: string; desc: string; features: string[] }) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        <Icon name={icon} size="md" />
      </div>
      <h3 className="font-manrope font-black text-xl text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant mb-4 flex-grow">{desc}</p>
      <div className="space-y-2 mt-auto pt-4 border-t border-outline-variant/20">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary/50" />
            <span className="text-xs text-on-surface font-medium">{f}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function FrontendArchitecturePage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-inter antialiased">
      
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 border-b border-outline-variant/20 bg-surface/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-black">
              S
            </div>
            <span className="font-manrope font-black text-on-surface tracking-tight">SIATA Logistics</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors"
          >
            <Icon name="arrow_back" size="xs" />
            <span>Volver</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* ════ SECTION 1 — HERO ════ */}
        <section className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <SectionLabel>Frontend Architecture</SectionLabel>

          <h1 className="font-manrope font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1] text-on-surface max-w-5xl mx-auto">
            Arquitectura Detallada de <span className="text-primary">SIATA Logistics</span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-4xl mx-auto leading-relaxed mt-6">
            Documentación exhaustiva de la capa de interfaz. Esta solución está enfocada en organización escalable, gestión robusta del estado del cliente y de la sesión, consumo centralizado de servicios, y componentes altamente reutilizables.
          </p>
        </section>

        {/* ════ SECTION 2 — STACK TÉCNICO ════ */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <SectionLabel>1. Stack Tecnológico</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { name: "React 19", role: "Render de la interfaz", icon: "web" },
              { name: "TypeScript", role: "Tipado del dominio", icon: "data_object" },
              { name: "Vite", role: "Build y desarrollo", icon: "bolt" },
              { name: "React Router 7", role: "Navegación", icon: "route" },
              { name: "TanStack Query 5", role: "Estado asíncrono", icon: "sync" },
              { name: "Zustand", role: "Estado global de cliente", icon: "memory" },
              { name: "Axios", role: "Cliente HTTP centralizado", icon: "api" },
              { name: "React Hook Form", role: "Manejo de formularios", icon: "dynamic_form" },
              { name: "Zod", role: "Validación de schemas", icon: "check_circle" },
              { name: "Tailwind CSS 4", role: "Sistema utilitario", icon: "palette" },
              { name: "Sonner", role: "Notificaciones globales", icon: "notifications" },
              { name: "Material Symbols", role: "Iconografía", icon: "star" },
            ].map((tech, idx) => (
              <Card key={idx} className="p-5 hover:border-primary/40 transition-colors group flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon name={tech.icon} size="sm" />
                </div>
                <div>
                  <h3 className="font-manrope font-black text-on-surface text-sm">{tech.name}</h3>
                  <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">{tech.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ════ SECTION 3 — PRINCIPIOS ════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>2. Principios de Arquitectura</SectionLabel>
            <h2 className="font-manrope font-black text-3xl md:text-4xl text-on-surface mt-2 mb-6">
              Separación de Responsabilidades
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              La aplicación sigue una arquitectura por dominios funcionales. Las decisiones más críticas buscan garantizar la escalabilidad a largo plazo.
            </p>
            <DetailList items={[
              "Separar estrictamente UI, estado y acceso a datos.",
              "Agrupar el código por 'feature' y no por tipo de archivo global.",
              "Centralizar el acceso HTTP para evitar duplicación de reglas de negocio.",
              "Usar schemas de Zod como el único contrato de validación.",
              "Delegar todo estado remoto a React Query y el local a Zustand.",
              "Proteger rutas desde el router, aislando la seguridad de las pantallas.",
              "Crear componentes altamente genéricos (DataTable, SearchableSelect)."
            ]} />
          </div>
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h3 className="font-manrope font-black text-xl text-on-surface mb-6">Flujo de Datos Unidireccional</h3>
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                <span className="text-sm font-bold">1. UI Component</span>
                <Icon name="arrow_downward" size="sm" className="text-primary" />
              </div>
              <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                <span className="text-sm font-bold">2. Custom Hook (React Query)</span>
                <Icon name="arrow_downward" size="sm" className="text-primary" />
              </div>
              <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                <span className="text-sm font-bold">3. Feature Service (Axios)</span>
                <Icon name="arrow_downward" size="sm" className="text-primary" />
              </div>
              <div className="bg-primary text-white p-4 rounded-xl flex items-center justify-between shadow-lg shadow-primary/20">
                <span className="text-sm font-bold">4. Backend API</span>
                <Icon name="cloud" size="sm" />
              </div>
            </div>
          </Card>
        </section>

        {/* ════ SECTION 4 — ESTRUCTURA Y ARRANQUE ════ */}
        <section className="space-y-12">
          <div>
            <SectionLabel>3. Estructura y Arranque</SectionLabel>
            <h2 className="font-manrope font-black text-3xl md:text-4xl text-on-surface mt-2 mb-8">
              Organización del Repositorio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 md:col-span-2 flex flex-col justify-center">
                <div className="font-mono text-sm text-on-surface-variant space-y-1.5 overflow-x-auto">
                  <p className="text-primary font-bold">src/</p>
                  <p className="pl-4">├── <strong className="text-on-surface">app/</strong> <span className="opacity-60 text-xs"># Router, providers y query-client global</span></p>
                  <p className="pl-4">├── <strong className="text-on-surface">assets/</strong> <span className="opacity-60 text-xs"># Recursos estáticos</span></p>
                  <p className="pl-4">├── <strong className="text-on-surface">components/</strong> <span className="opacity-60 text-xs"># UI reutilizable (DataTables, Inputs)</span></p>
                  <p className="pl-4">├── <strong className="text-on-surface text-primary">features/</strong> <span className="opacity-60 text-xs"># Módulos de dominio</span></p>
                  <p className="pl-8">│   ├── <strong className="text-secondary">auth/</strong></p>
                  <p className="pl-8">│   ├── <strong className="text-secondary">shipment/</strong></p>
                  <p className="pl-12">│   │   ├── components/ <span className="opacity-60 text-xs"># UI específica del módulo</span></p>
                  <p className="pl-12">│   │   ├── pages/ <span className="opacity-60 text-xs"># Pantallas ruteables</span></p>
                  <p className="pl-12">│   │   ├── types/ <span className="opacity-60 text-xs"># Interfaces y Schemas Zod</span></p>
                  <p className="pl-12">│   │   └── services.ts <span className="opacity-60 text-xs"># Llamadas HTTP del dominio</span></p>
                  <p className="pl-8">│   └── <strong className="text-secondary">...</strong></p>
                  <p className="pl-4">├── <strong className="text-on-surface">layouts/</strong> <span className="opacity-60 text-xs"># Layouts de página</span></p>
                  <p className="pl-4">├── <strong className="text-on-surface">lib/</strong> <span className="opacity-60 text-xs"># Instancia de Axios y utilidades core</span></p>
                  <p className="pl-4">├── <strong className="text-on-surface">providers/</strong> <span className="opacity-60 text-xs"># Contextos globales (Modales, Notifier)</span></p>
                  <p className="pl-4">├── <strong className="text-on-surface">services/</strong> <span className="opacity-60 text-xs"># Capa base (BaseService)</span></p>
                  <p className="pl-4">└── <strong className="text-on-surface">store/</strong> <span className="opacity-60 text-xs"># Estado global persistido con Zustand</span></p>
                </div>
              </Card>
              
              <div className="space-y-4">
                <Card className="p-5">
                  <h4 className="font-bold text-sm mb-2 text-primary flex items-center gap-2"><Icon name="power" size="xs"/> Bootstrapping</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    El entry point (<code>main.tsx</code>) monta la aplicación envolviendo el router con: <strong>QueryClientProvider</strong>, <strong>ThemeProvider</strong>, <strong>NotifierProvider</strong> y <strong>ModalProvider</strong>, estrictamente en ese orden para garantizar jerarquía de dependencias.
                  </p>
                </Card>
                <Card className="p-5">
                  <h4 className="font-bold text-sm mb-2 text-primary flex items-center gap-2"><Icon name="speed" size="xs"/> React Query</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Configuración global estable: <code>staleTime</code> de 5 minutos, retry limitado a 1 intento, refetch en focus deshabilitado. Reduce drásticamente las llamadas innecesarias al servidor.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ════ SECTION 5 — RUTAS Y ESTADO ════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionLabel>4. Navegación y Acceso</SectionLabel>
            <h3 className="font-manrope font-black text-2xl text-on-surface mb-4">Router y Layouts</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              El enrutamiento está centralizado y segmentado en 4 zonas clave, cada una protegida por un layout y *Guards* específicos:
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low rounded-2xl">
                <p className="font-bold text-sm mb-1">Públicas (<code>/</code>)</p>
                <p className="text-xs text-on-surface-variant">Landing page. Accesible para todos.</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-2xl">
                <p className="font-bold text-sm mb-1">Auth (<code>/auth/*</code>) + PublicGuard</p>
                <p className="text-xs text-on-surface-variant">Protegida contra usuarios ya logueados. Layout sencillo.</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-2xl">
                <p className="font-bold text-sm mb-1">Dashboard (<code>/dashboard/*</code>) + AuthGuard</p>
                <p className="text-xs text-on-surface-variant">Área privada de operación. Usa DashboardLayout con sidebar.</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-2xl border-l-4 border-primary">
                <p className="font-bold text-sm mb-1 text-primary">Admin (<code>/admin/*</code>) + RoleGuard</p>
                <p className="text-xs text-on-surface-variant">Restringido globalmente a usuarios con rol ADMIN. Usa AdminLayout con doble navegación.</p>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>5. Estado Global</SectionLabel>
            <h3 className="font-manrope font-black text-2xl text-on-surface mb-4">Zustand Stores</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              El estado global se divide en stores pequeños y altamente especializados, evitando re-renders masivos:
            </p>
            <div className="space-y-4">
              <Card className="p-5">
                <h4 className="font-bold text-sm flex items-center gap-2"><Icon name="shield_person" size="sm" className="text-primary"/> Auth Store</h4>
                <p className="text-xs text-on-surface-variant mt-2">
                  Guarda `accessToken`, perfil de `user` y `isAuthenticated`. Persistido en localStorage (`siata-auth-storage`).
                </p>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold text-sm flex items-center gap-2"><Icon name="menu_open" size="sm" className="text-primary"/> Sidebar Store</h4>
                <p className="text-xs text-on-surface-variant mt-2">
                  Persiste la preferencia de colapso del menú lateral entre recargas, mejorando la experiencia de usuario.
                </p>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold text-sm flex items-center gap-2"><Icon name="picture_in_picture" size="sm" className="text-primary"/> Modal Store</h4>
                <p className="text-xs text-on-surface-variant mt-2">
                  Centraliza el estado global de ventanas modales. Una única instancia de renderizado previene conflictos de z-index y facilita invocar cualquier formulario desde cualquier lugar.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ════ SECTION 6 — CAPA DE DATOS E HTTP ════ */}
        <section className="space-y-8">
          <div className="text-center">
            <SectionLabel>6. Capa de Datos</SectionLabel>
            <h2 className="font-manrope font-black text-3xl md:text-4xl text-on-surface mt-2 mb-4">
              Arquitectura HTTP y Peticiones
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-on-surface-variant leading-relaxed">
              La conexión con la API sigue un patrón estricto de cliente centralizado y servicios modulares, evitando hardcoding de rutas o inyección manual de tokens en cada componente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Icon name="http" size="lg" />
              </div>
              <h3 className="font-bold text-lg mb-3">Axios Centralizado</h3>
              <DetailList items={[
                "Configurado con baseURL dinámica via VITE_API_BASE_URL.",
                "Interceptor de request: inyecta automáticamente Authorization Bearer leyendo del localStorage o store.",
                "Interceptor de response: captura globales (como 401 Unauthorized) ejecutando el cierre de sesión proactivo."
              ]} />
            </Card>

            <Card className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Icon name="model_training" size="lg" />
              </div>
              <h3 className="font-bold text-lg mb-3">BaseService</h3>
              <DetailList items={[
                "Clase abstracta que estandariza las rutas de la API.",
                "Mapeo de convenciones: /{version}/{module}/{path}.",
                "Facilita la transición futura entre versiones de API (v1 a v2) sin reescribir la lógica de cada feature."
              ]} />
            </Card>
          </div>
        </section>

        {/* ════ SECTION 7 — FUNCIONALIDADES ════ */}
        <section className="space-y-8">
          <SectionLabel>7. Módulos Funcionales</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard 
              title="Autenticación" 
              icon="passkey" 
              desc="Flujo Login/Register basado en OTP en vez de contraseñas."
              features={["OTP 6 dígitos", "Persistencia segura", "Redirección inteligente"]}
            />
            <ModuleCard 
              title="Envíos (Shipments)" 
              icon="local_shipping" 
              desc="El módulo más robusto. Múltiples filtros cruzados y paginación remota de alto volumen."
              features={["Filtros avanzados", "Paginación Server-Side", "Panel de detalles"]}
            />
            <ModuleCard 
              title="Logística" 
              icon="warehouse" 
              desc="Administración en Pestañas (Tabs) separando Bodegas Terrestres y Puertos Marítimos."
              features={["Modales dinámicos", "Validación específica por tab", "Listados cacheados"]}
            />
            <ModuleCard 
              title="Productos" 
              icon="category" 
              desc="Módulo de catálogo estándar con soporte avanzado de filtros locales en la tabla."
              features={["Búsqueda rápida", "Filtro Tamaño/Tipo", "Paginación local (200 rows)"]}
            />
            <ModuleCard 
              title="Clientes" 
              icon="groups" 
              desc="Gestión de destinatarios y remitentes, enlazados fuertemente con la creación de envíos."
              features={["Validación de Email", "DataTable Genérica", "Invocable globalmente"]}
            />
            <ModuleCard 
              title="Administración" 
              icon="admin_panel_settings" 
              desc="Módulo exclusivo para rol ADMIN. Gestión de permisos de usuarios y trazabilidad de sistema."
              features={["Gestión de Roles", "Override de Estados", "Historial de auditoría"]}
            />
          </div>
        </section>

        {/* ════ SECTION 8 — COMPONENTES Y FORMULARIOS ════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <SectionLabel>8. UI y Formularios</SectionLabel>
            <h3 className="font-manrope font-black text-3xl text-on-surface mb-6">Primitivas UI y Validaciones</h3>
            <Card className="p-6 border-l-4 border-l-primary">
              <h4 className="font-bold flex items-center gap-2 mb-2"><Icon name="table" size="sm"/> Genérico: DataTable</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                El componente más crítico. Soporta búsqueda, paginación remota o en memoria, acciones por fila, skeletons nativos y vistas vacías parametrizables. Totalmente agnóstico al dominio.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-bold flex items-center gap-2 mb-2"><Icon name="list_alt" size="sm"/> Formularios (RHF + Zod)</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Renderizado ultra rápido sin pérdida de keystrokes gracias a React Hook Form. Cada formulario se valida contra un esquema tipado de Zod, reflejando reglas como: `cantidad &gt; 0` o placas terrestres en formato `AAA123`.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-bold flex items-center gap-2 mb-2"><Icon name="bug_report" size="sm"/> Manejo de Errores</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Un ErrorBoundary global evita colapsos completos de React. Traducimos códigos HTTP crudos (422, 500) en notificaciones legibles (vía Sonner) antes de presentarlos al usuario.
              </p>
            </Card>
          </div>

          <Card className="bg-surface-container overflow-hidden flex flex-col">
            <div className="bg-surface-container-high p-4 border-b border-outline-variant/20 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-on-surface">zodResolver (Ejemplo Conceptual)</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-secondary/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
              </div>
            </div>
            <div className="p-6 text-sm font-mono text-on-surface-variant space-y-4 overflow-x-auto">
              <div>
                <span className="text-primary">const</span> shipmentSchema = z.object(&#123;
              </div>
              <div className="pl-4">
                cantidad: z.number().min(1, <span className="text-secondary">"Debe ser &gt; 0"</span>),<br/>
                numero_guia: z.string().length(10),<br/>
                placa_vehiculo: z.string().regex(<span className="text-primary">/^[A-Z]&#123;3&#125;\d&#123;3&#125;$/</span>),
              </div>
              <div>&#125;);</div>
              <div className="pt-4 border-t border-outline-variant/20">
                <span className="opacity-50">// En el componente de interfaz</span><br/>
                <span className="text-primary">const</span> form = useForm(&#123;<br/>
                <span className="pl-4">resolver: zodResolver(shipmentSchema)</span><br/>
                &#125;);
              </div>
            </div>
          </Card>
        </section>

        {/* ════ SECTION 9 — GOOD TO KNOW / PASOS SIGUIENTES ════ */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Card className="p-10 md:p-14 relative overflow-hidden bg-primary text-white shadow-2xl">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start justify-between">
              <div className="max-w-xl">
                <SectionLabel><span className="text-white/80">Evolución</span></SectionLabel>
                <h2 className="font-manrope font-black text-3xl md:text-5xl text-white mt-1 mb-6 leading-tight">
                  Good To Know <br/>
                  <span className="text-white/70 text-2xl md:text-3xl">Pasos Siguientes</span>
                </h2>
                <p className="text-white/80 leading-relaxed text-sm md:text-base">
                  Por temas de tiempo y practicidad enfocados en la prueba técnica, existen mejoras arquitectónicas y funcionales que no fueron implementadas en esta primera iteración. Sin embargo, estas representan el mapa de ruta (Roadmap) natural para escalar este sistema a un nivel Enterprise.
                </p>
              </div>

              <div className="w-full md:w-auto flex-grow max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Icon name="science" size="sm" className="text-white shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Testing Automatizado</h4>
                      <p className="text-xs text-white/70 mt-1">Implementación de Jest o Vitest para lógica de Zustand y React Testing Library para componentes críticos como DataTable y Formularios.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="splitscreen" size="sm" className="text-white shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Code Splitting por Ruta</h4>
                      <p className="text-xs text-white/70 mt-1">Configurar <code>React.lazy()</code> para que el bundle del área Admin no se cargue en el chunk principal del Dashboard, mejorando el TTI.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="view_quilt" size="sm" className="text-white shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Catálogo Storybook</h4>
                      <p className="text-xs text-white/70 mt-1">Aislar primitivas visuales en Storybook para iterar el diseño independiente de los datos de backend.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="monitor_heart" size="sm" className="text-white shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Monitoreo y Telemetría</h4>
                      <p className="text-xs text-white/70 mt-1">Integración con Sentry/Datadog para atrapar errores asíncronos y monitorear la performance en el cliente en tiempo real.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-outline-variant/20 mt-16 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-black">S</div>
            <span className="font-manrope font-black text-sm text-on-surface">SIATA Logistics</span>
          </div>
          <p className="text-[11px] text-outline/80 font-medium tracking-wide">
            Arquitectura Frontend · React 19 + TypeScript
          </p>
        </div>
      </footer>

    </div>
  );
}
