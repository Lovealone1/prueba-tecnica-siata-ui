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

// ─── Main Page ────────────────────────────────────────────────────────────────

export function DatabaseArchitecturePage() {
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
          <SectionLabel>Database Architecture</SectionLabel>

          <h1 className="font-manrope font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1] text-on-surface max-w-5xl mx-auto">
            Estructura de Datos y <span className="text-primary">Modelo ER</span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-4xl mx-auto leading-relaxed mt-6">
            Documentación del modelo relacional de la aplicación, el diseño de sus entidades y el sistema de versionado de esquemas que garantiza su escalabilidad en producción.
          </p>
        </section>

        {/* ════ SECTION 2 — DIAGRAMA ER ════ */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <SectionLabel>1. Diagrama Entidad-Relación</SectionLabel>
          <Card className="p-8 mt-6 overflow-hidden">
            <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center border border-outline-variant/20 shadow-inner relative">
              <img 
                src="/assets/images/diagramaER.png" 
                alt="Diagrama Entidad-Relación" 
                className="max-w-full h-auto rounded-xl object-contain"
                style={{ maxHeight: '600px' }}
              />
              <a 
                href="/assets/images/diagramaER.png" 
                download="diagrama_er_siata_logistics.png"
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-surface/90 backdrop-blur text-on-surface border border-outline-variant/30 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface transition-all shadow-sm"
              >
                <Icon name="download" size="xs" />
                <span>Descargar</span>
              </a>
            </div>
            <div className="mt-8 space-y-4">
              <h3 className="font-manrope font-black text-2xl text-on-surface">Explicación del Modelo Relacional</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                El sistema se ha modelado utilizando una base de datos <strong>PostgreSQL</strong> aprovechando fuertemente el uso de Enums, constraints y UUIDs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-primary flex items-center gap-2"><Icon name="person" size="xs"/> Usuarios (Users)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Maneja la autenticación y autorización. Almacena credenciales, roles globales (<code>ADMIN</code> / <code>USER</code>) y datos de contacto. Utiliza <code>citext</code> para el correo asegurando unicidad case-insensitive.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-primary flex items-center gap-2"><Icon name="local_shipping" size="xs"/> Envíos (Shipments)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Es el pivote central del negocio. Vincula un <code>Cliente</code> con un <code>Producto</code> y opcionalmente con un nodo logístico (<code>Warehouse</code> o <code>Seaport</code>). Conserva metadatos críticos como el precio base, total, fechas y número de guía único.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-primary flex items-center gap-2"><Icon name="warehouse" size="xs"/> Nodos Logísticos (Seaports / Warehouses)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Tablas independientes para infraestructura marítima y terrestre. Simplifican las queries en lugar de una tabla hiper-polimórfica, garantizando integridad referencial estricta desde `shipments`.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-primary flex items-center gap-2"><Icon name="history" size="xs"/> Historial (Shipment Status Logs)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Tabla de auditoría para trazar los cambios de estado (<code>PENDING</code> -&gt; <code>SENT</code> -&gt; <code>DELIVERED</code>) de cada envío, fundamental para la trazabilidad operativa requerida por administradores.</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ════ SECTION 3 — MIGRACIONES Y ALEMBIC ════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>2. Versionado de la Base de Datos</SectionLabel>
            <h2 className="font-manrope font-black text-3xl md:text-4xl text-on-surface mt-2 mb-6">
              Migraciones vs Raw SQL
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Si bien proveemos un script SQL plano para facilitar el setup inicial, el entorno real de producción y el desarrollo continuo se gestionan con <strong>Alembic</strong>.
            </p>
            <p className="text-sm font-bold text-on-surface mb-3">¿Por qué usar un sistema de migraciones?</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Icon name="verified" size="sm" className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface-variant leading-relaxed"><strong>Evolución Incremental:</strong> En lugar de recrear la base de datos entera (usando destructivos `DROP TABLE`), Alembic aplica solo los deltas o "diferencias" estructurales.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="undo" size="sm" className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface-variant leading-relaxed"><strong>Rollback Seguro (Up/Down):</strong> Cada migración define cómo avanzar (`upgrade`) y cómo retroceder (`downgrade`). Si un despliegue falla, la base de datos puede volver a su versión anterior sin pérdida de integridad.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="groups" size="sm" className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface-variant leading-relaxed"><strong>Sincronización de Equipos:</strong> Evita conflictos al trabajar de manera colaborativa, asegurando que todos los desarrolladores tengan el esquema exacto mediante el control de la tabla `alembic_version`.</span>
              </li>
            </ul>
          </div>
          <Card className="p-8 bg-surface-container overflow-hidden">
            <h3 className="font-manrope font-black text-xl text-on-surface mb-6 flex items-center gap-2">
              <Icon name="schema" size="md" className="text-primary"/> 
              Script DDL Base
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              El script adjunto contiene todas las definiciones originales de esquemas, tipos, extensiones y tablas (como `citext` y `uuid_ossp`). 
            </p>
            <div className="bg-surface-container-highest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-on-surface-variant overflow-x-auto mb-6 opacity-70">
              -- DROP SCHEMA public;<br/><br/>
              CREATE SCHEMA public AUTHORIZATION pg_database_owner;<br/><br/>
              -- ...<br/>
              CREATE TABLE public.shipments (<br/>
              &nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() NOT NULL,<br/>
              &nbsp;&nbsp;customer_id uuid NOT NULL,<br/>
              &nbsp;&nbsp;...<br/>
              );
            </div>
            <a 
              href="/docs/schema.sql" 
              download="schema.sql"
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              <Icon name="download" size="sm" />
              <span>Descargar Script SQL Completo</span>
            </a>
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
            Arquitectura de Base de Datos · PostgreSQL + Alembic
          </p>
        </div>
      </footer>

    </div>
  );
}
