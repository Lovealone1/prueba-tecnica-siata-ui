import { Link } from "react-router-dom";
import { Icon } from "@/utils/icon";

// ─── Data ────────────────────────────────────────────────────────────────────

const landFields = [
  "Tipo de producto",
  "Cantidad de producto a enviar",
  "Fecha de registro",
  "Fecha de entrega",
  "Bodega de entrega",
  "Precio de envío",
  "Placa del vehículo (3 letras + 3 números · ej. AAA123)",
  "Número de guía (10 dígitos alfanuméricos)",
];

const seaFields = [
  "Tipo de producto",
  "Cantidad de productos a enviar",
  "Fecha de registro",
  "Fecha de entrega",
  "Puerto de entrega",
  "Precio de envío",
  "Número de flota (3 letras + 4 números + 1 letra · ej. AAA1234A)",
  "Número de guía (10 dígitos alfanuméricos)",
];

const businessRules = [
  { num: 1, text: "Cada envío debe quedar relacionado a un cliente para poder hacer el seguimiento correcto del servicio." },
  { num: 2, text: "Si la cantidad de productos es mayor a 10 unidades, se otorga un descuento del 5 % al precio total para logística terrestre." },
  { num: 3, text: "Si la cantidad de productos es mayor a 10 unidades, se otorga un descuento del 3 % al precio total para logística marítima." },
  { num: 4, text: "El campo numero_guia debe ser único en todo el sistema." },
  { num: 5, text: "El campo cantidad_producto debe ser siempre mayor que 0." },
  { num: 6, text: "Validación estricta de placas de camiones (AAA123) y número de flota (AAA1234A) mediante expresiones regulares." },
  { num: 7, text: "CRUD completo de: Productos, Envíos, Clientes, Puertos y Bodegas." },
  { num: 8, text: "Los datos deben almacenarse en alguno de los motores: MySQL, SQL Server, PostgreSQL o MongoDB." },
];

const bonusItems = [
  { icon: "rocket_launch", text: "Despliegue en servidor público con instrucciones de acceso." },
  { icon: "call_split", text: "Separación estricta de Backend y Frontend en repositorios distintos." },
  { icon: "api", text: "Documentación API REST completa (Swagger / ReDoc)." },
  { icon: "manage_accounts", text: "Registro y autenticación de usuarios." },
  { icon: "token", text: "Seguridad de servicios mediante token Bearer (validación JWT)." },
  { icon: "bug_report", text: "Manejo de errores con códigos HTTP apropiados (400, 401, 422, 500)." },
  { icon: "admin_panel_settings", text: "Autorización de acceso con sistema de roles (RBAC)." },
  { icon: "route", text: "Navegación SPA: «Volver», «Inicio» y navegación entre funcionalidades." },
];

const evalCriteria = [
  { icon: "folder_open", label: "Estructura del proyecto" },
  { icon: "code", label: "Calidad y claridad del código" },
  { icon: "verified_user", label: "Manejo de validaciones y errores" },
  { icon: "hub", label: "Diseño de la API" },
  { icon: "description", label: "Documentación del proyecto" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary/80 mb-3">
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

function FieldList({ fields, color }: { fields: string[]; color: "primary" | "secondary" }) {
  const dot = color === "primary" ? "bg-primary" : "bg-secondary";
  return (
    <ul className="space-y-2.5 mt-4">
      {fields.map((f, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
          <span className="text-sm text-on-surface-variant leading-relaxed">{f}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-inter antialiased">

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 border-b border-outline-variant/20 bg-surface/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-black">
              S
            </div>
            <span className="font-manrope font-black text-on-surface tracking-tight">SIATA Logistics</span>
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to="/frontend-architecture"
                className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest hover:bg-primary/20 transition-colors"
              >
                Docs Frontend
              </Link>
              <Link 
                to="/backend-architecture"
                className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full uppercase tracking-widest hover:bg-secondary/20 transition-colors"
              >
                Docs Backend
              </Link>
              <Link 
                to="/database-architecture"
                className="text-[10px] font-bold bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full uppercase tracking-widest hover:bg-tertiary/20 transition-colors"
              >
                Docs DB
              </Link>
            </div>
          </div>
          <Link
            to="/auth/login"
            id="nav-go-to-app"
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <span>Ir a la App</span>
            <Icon name="arrow_forward" size="xs" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* ══════════════════════════════════════════════
            SECTION 1 — HERO / ENUNCIADO
        ══════════════════════════════════════════════ */}
        <section id="challenge" className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <SectionLabel>Prueba Técnica · Desarrollador Fullstack</SectionLabel>

          <h1 className="font-manrope font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.9] text-on-surface">
            Gestión Logística{" "}
            <span className="text-primary">de Envíos</span>
            <br />
            <span className="text-outline/60">Terrestres y Marítimos</span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Evaluación de capacidades de análisis de negocio, modelado de datos y desarrollo
            fullstack — midiendo el nivel de seniority a través de patrones de diseño,
            buenas prácticas y funcionalidades bonus implementadas.
          </p>

          {/* Tech pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Redis", "Docker"].map((t) => (
              <span key={t} className="text-[11px] font-bold bg-surface-container-low border border-outline-variant/30 text-on-surface-variant px-3 py-1.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 2 — OBJETIVO
        ══════════════════════════════════════════════ */}
        <section id="objetivo" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <SectionLabel>Objetivo</SectionLabel>
          <Card className="p-8 md:p-10">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon name="flag" size="lg" />
              </div>
              <div className="space-y-3">
                <h2 className="font-manrope font-black text-2xl text-on-surface">Contexto del Reto</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Una empresa de gestión logística requiere una nueva aplicación para administrar la
                  logística de <strong className="text-on-surface">envíos terrestres y marítimos</strong>.
                  El sistema debe registrar datos básicos de clientes, tipos de productos, bodegas de
                  almacenamiento terrestre y puertos marítimos a nivel nacional e internacional.
                </p>
                <div className="mt-4 p-4 bg-primary/5 border border-primary/15 rounded-2xl">
                  <p className="text-sm text-primary font-medium">
                    <strong>Nota:</strong> El nivel de seniority del candidato (Jr / Ssr / Sr) se determina
                    por los bonus desarrollados, los patrones utilizados y las buenas prácticas aplicadas.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 3 — PLANES DE ENTREGA
        ══════════════════════════════════════════════ */}
        <section id="planes-entrega" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <SectionLabel>Planes de Entrega</SectionLabel>
          <h2 className="font-manrope font-black text-3xl text-on-surface">Datos Requeridos por Modalidad</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Terrestre */}
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="local_shipping" size="lg" />
                </div>
                <div>
                  <h3 className="font-manrope font-black text-xl text-on-surface">Logística Terrestre</h3>
                  <p className="text-xs text-on-surface-variant">Plan de entrega por camión</p>
                </div>
              </div>
              <FieldList fields={landFields} color="primary" />
            </Card>

            {/* Marítima */}
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Icon name="sailing" size="lg" />
                </div>
                <div>
                  <h3 className="font-manrope font-black text-xl text-on-surface">Logística Marítima</h3>
                  <p className="text-xs text-on-surface-variant">Plan de entrega por flota</p>
                </div>
              </div>
              <FieldList fields={seaFields} color="secondary" />
            </Card>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 4 — REGLAS DE NEGOCIO
        ══════════════════════════════════════════════ */}
        <section id="reglas-negocio" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <SectionLabel>Reglas de Negocio</SectionLabel>
          <h2 className="font-manrope font-black text-3xl text-on-surface">El Sistema Debe Cumplir</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businessRules.map((r) => (
              <div
                key={r.num}
                className="flex items-start gap-4 p-5 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl hover:border-primary/30 hover:bg-primary/3 transition-all group"
              >
                <span className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-black flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  {r.num}
                </span>
                <p className="text-sm text-on-surface-variant leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 5 — BONUS
        ══════════════════════════════════════════════ */}
        <section id="bonus" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <SectionLabel>Funcionalidades Bonus</SectionLabel>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="font-manrope font-black text-3xl text-on-surface">
              Opcionales · Elevan el Seniority
            </h2>
            <span className="text-xs font-bold bg-primary text-white px-4 py-1.5 rounded-full">
              Todos implementados ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bonusItems.map((b, i) => (
              <div
                key={i}
                className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all group text-center space-y-3"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon name={b.icon} size="sm" />
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 6 — CRITERIOS DE EVALUACIÓN
        ══════════════════════════════════════════════ */}
        <section id="evaluacion" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-250">
          <SectionLabel>Criterios de Evaluación</SectionLabel>
          <Card className="p-8 md:p-10">
            <h2 className="font-manrope font-black text-2xl text-on-surface mb-8">La Solución Será Evaluada en</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {evalCriteria.map((c, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:border-primary/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon name={c.icon} size="sm" />
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant leading-tight">{c.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 7 — CTA
        ══════════════════════════════════════════════ */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-14 text-center space-y-6">
            {/* decorative blobs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white/5 -translate-y-1/2" />

            <div className="relative">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">Solución Implementada</p>
              <h2 className="font-manrope font-black text-3xl md:text-4xl text-white leading-tight">
                Explorar la plataforma
              </h2>
              <p className="text-white/70 mt-3 max-w-md mx-auto text-sm leading-relaxed">
                Accede al sistema de gestión logística con autenticación, roles y todas las
                funcionalidades requeridas y bonus implementadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  to="/auth/login"
                  id="cta-go-to-app"
                  className="px-8 py-4 bg-white text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/90 active:scale-[0.98] transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-2"
                >
                  <span>Ingresar a la Plataforma</span>
                  <Icon name="arrow_forward" size="xs" />
                </Link>
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL}/redoc`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="cta-api-docs"
                  className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="api" size="xs" />
                  <span>API Docs (Redoc)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-outline-variant/20 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-black">S</div>
            <span className="font-manrope font-black text-sm text-on-surface">SIATA Logistics</span>
          </div>
          <p className="text-[11px] text-outline/60 font-medium tracking-wide">
            Prueba Técnica · Desarrollador Fullstack · {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-outline font-bold">
            <Link to="/frontend-architecture" className="hover:text-primary transition-colors">Docs Frontend</Link>
            <span className="text-outline-variant">·</span>
            <Link to="/backend-architecture" className="hover:text-primary transition-colors">Docs Backend</Link>
            <span className="text-outline-variant">·</span>
            <Link to="/database-architecture" className="hover:text-primary transition-colors">Docs DB</Link>
            <span className="text-outline-variant">·</span>
            <a href={`${import.meta.env.VITE_API_BASE_URL}/redoc`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">API Docs</a>
            <span className="text-outline-variant">·</span>
            <Link to="/auth/login" className="hover:text-primary transition-colors">Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
