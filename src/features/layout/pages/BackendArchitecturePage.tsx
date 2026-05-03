import { Link } from "react-router-dom";
import { Icon } from "@/utils/icon";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#f1f4f9', 
    primaryTextColor: '#1f2023',
    primaryBorderColor: '#outline-variant',
    lineColor: '#5e6267', 
    secondaryColor: '#1b73cd', 
    tertiaryColor: '#fff',
    fontFamily: 'Inter, sans-serif'
  }
});

function MermaidChart({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(2, 8)}`, chart)
        .then(({ svg }) => {
          if (containerRef.current) containerRef.current.innerHTML = svg;
        })
        .catch(e => console.error("Mermaid rendering failed:", e));
    }
  }, [chart]);

  return <div ref={containerRef} className="flex justify-center w-full overflow-x-auto py-4" />;
}

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

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BackendArchitecturePage() {
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
          <SectionLabel>Backend Architecture</SectionLabel>

          <h1 className="font-manrope font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1] text-on-surface max-w-5xl mx-auto">
            Clean Architecture en un <span className="text-primary">Backend Modular</span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-4xl mx-auto leading-relaxed mt-6">
            Documentación exhaustiva de la capa Backend. La solución no se fragmentó en microservicios prematuros, sino que agrupa capacidades de negocio en módulos robustos que comparten infraestructura de persistencia, seguridad y observabilidad sobre FastAPI.
          </p>
        </section>

        {/* ════ SECTION 2 — STACK TÉCNICO ════ */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <SectionLabel>1. Stack Tecnológico</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { name: "FastAPI", role: "API, validación y OpenAPI", icon: "bolt" },
              { name: "Python 3.13", role: "Lenguaje base", icon: "code" },
              { name: "PostgreSQL", role: "Persistencia transaccional", icon: "database" },
              { name: "SQLAlchemy 2", role: "ORM asíncrono", icon: "data_object" },
              { name: "Alembic", role: "Migraciones de esquema", icon: "history" },
              { name: "Redis", role: "Sesiones, OTP y caché", icon: "memory" },
              { name: "JWT + Bearer", role: "Seguridad y autenticación", icon: "lock" },
              { name: "Pydantic v2", role: "Validación y DTOs", icon: "fact_check" },
              { name: "Dependency Injector", role: "Wiring de servicios", icon: "hub" },
              { name: "Docker", role: "Ejecución reproducible", icon: "layers" },
              { name: "Poetry", role: "Gestión de paquetes", icon: "inventory" },
              { name: "Uvicorn", role: "Servidor ASGI", icon: "terminal" },
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

        {/* ════ SECTION 2.5 — ALCANCE VS VALOR AGREGADO ════ */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="text-center">
            <SectionLabel>2. Alcance vs Valor Agregado</SectionLabel>
            <h2 className="font-manrope font-black text-3xl md:text-4xl text-on-surface mt-2 mb-4">
              Más allá del CRUD Básico
            </h2>
            <p className="max-w-3xl mx-auto text-sm text-on-surface-variant leading-relaxed mb-6">
              La prueba técnica partía de un escenario deliberadamente básico. Sobre esa base, el backend incorpora capas que lo acercan a una solución real de operación, con seguridad, auditoría y automatizaciones.
            </p>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-outline-variant/30">
            <table className="w-full text-left border-collapse bg-surface-container-lowest">
              <thead>
                <tr>
                  <th className="p-5 border-b-2 border-outline-variant/30 text-sm font-black text-on-surface w-1/2">Requisito Original de la Prueba</th>
                  <th className="p-5 border-b-2 border-primary text-sm font-black text-primary w-1/2 bg-primary/5">Extensión Arquitectónica Implementada</th>
                </tr>
              </thead>
              <tbody className="text-sm text-on-surface-variant">
                {[
                  ["CRUD de clientes, productos, envíos, bodegas y puertos", "CRUD modular con routers, servicios, repositorios, DTOs y validaciones de dominio"],
                  ["Validar cantidad, número de guía, placa y número de flota", "Validaciones por esquema Pydantic, unicidad en BD y reglas de formato Regex en servicios"],
                  ["Calcular un precio de envío", "Motor logístico que calcula tipo de envío, ETA, precio base, cargo extra y descuento automático"],
                  ["Relacionar el envío con un cliente", "Orquestación completa con customer, product y nodo logístico destino antes de persistir"],
                  ["Seguridad opcional por token Bearer", "Autenticación OTP con JWT híbrido y sesión persistida/revocable en Redis"],
                  ["Autorización básica (si aplica)", "RBAC estricto con roles ADMIN y USER, con restricciones por acción en endpoints clave"],
                  ["Sin trazabilidad operativa formal", "Audit log inmutable, middlewares de RequestInfo con ContextVar e historial de estados"],
                  ["Generación manual de identificadores", "Generación atómica de guide_number (Redis), placa y número de flota cuando el cliente no los provee"]
                ].map(([base, ext], i) => (
                  <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td className="p-5">{base}</td>
                    <td className="p-5 font-medium text-on-surface bg-primary/5">{ext}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ════ SECTION 3 — CAPAS DE ARQUITECTURA ════ */}
        <section className="space-y-8">
          <div className="text-center">
            <SectionLabel>3. Clean Architecture Pragmática</SectionLabel>
            <h2 className="font-manrope font-black text-3xl md:text-4xl text-on-surface mt-2 mb-4">
              Separación por Capas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 border-t-4 border-t-primary">
              <h3 className="font-bold text-lg mb-2 text-primary flex items-center gap-2">
                <Icon name="api" size="sm"/> 3.1 Presentation / API
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Traduce peticiones HTTP a DTOs y viceversa.
              </p>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/30 text-xs text-on-surface-variant mb-4">
                Ubicación: <code>app/main.py</code>, <code>v1_router.py</code>, <code>router.py</code>
              </div>
              <DetailList items={[
                "Exposición interactiva (Swagger / ReDoc).",
                "Declaración de dependencias Auth/Roles.",
                "Traducción a Pydantic y retorno de códigos HTTP."
              ]} />
            </Card>

            <Card className="p-8 border-t-4 border-t-secondary">
              <h3 className="font-bold text-lg mb-2 text-secondary flex items-center gap-2">
                <Icon name="settings" size="sm"/> 3.2 Application / Use Cases
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Orquesta la lógica transaccional y reglas de negocio.
              </p>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/30 text-xs text-on-surface-variant mb-4">
                Ubicación: <code>service.py</code> en cada módulo.
              </div>
              <DetailList items={[
                "Valida reglas complejas.",
                "Orquesta repositorios, caché y helpers.",
                "Mantiene la API ignorante de SQLAlchemy."
              ]} />
            </Card>

            <Card className="p-8 border-t-4 border-t-tertiary">
              <h3 className="font-bold text-lg mb-2 text-tertiary flex items-center gap-2">
                <Icon name="category" size="sm"/> 3.3 Domain
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                El corazón estricto de las reglas.
              </p>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/30 text-xs text-on-surface-variant mb-4">
                Ubicación: <code>domain.py</code>, esquemas y DTOs.
              </div>
              <DetailList items={[
                "Define interfaces de repositorios.",
                "Alberga enumeraciones del negocio.",
                "Define contratos inmutables."
              ]} />
            </Card>

            <Card className="p-8 border-t-4 border-t-outline-variant">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Icon name="dns" size="sm"/> 3.4 Infrastructure
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                La implementación concreta de almacenamiento y librerías externas.
              </p>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/30 text-xs text-on-surface-variant mb-4">
                Ubicación: <code>app/core</code>, <code>app/infraestructure</code>
              </div>
              <DetailList items={[
                "Configuración de DB, Redis y Mail.",
                "Modelos ORM asíncronos.",
                "Migraciones con Alembic."
              ]} />
            </Card>
          </div>
        </section>

        {/* ════ SECTION X — FLUJOS DE NEGOCIO Y DIAGRAMAS ════ */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="text-center">
            <SectionLabel>4. Flujos de Negocio Críticos</SectionLabel>
            <h2 className="font-manrope font-black text-3xl md:text-4xl text-on-surface mt-2 mb-4">
              Core Logistics & Auth
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-on-surface-variant leading-relaxed">
              Los siguientes diagramas cubren los flujos transaccionales más importantes del sistema, mostrando la orquestación entre la API, los servicios de dominio y la infraestructura.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 items-start">
            
            <Card className="p-8 bg-surface-container">
              <h3 className="font-manrope font-black text-xl text-on-surface mb-6 text-primary flex items-center gap-2"><Icon name="key" size="sm"/> 4.1 Flujo de Autenticación Híbrida</h3>
              <div className="bg-white rounded-xl p-4 overflow-hidden border border-outline-variant/20 shadow-sm">
                <MermaidChart chart={`
flowchart TD
    A["Usuario solicita OTP"] --> B["POST /auth/otp"]
    B --> C["AuthService.request_otp"]
    C --> D{"Intent = LOGIN?"}
    D -- Si --> E["Validar usuario en PostgreSQL"]
    E --> F{"Usuario existe?"}
    F -- No --> X1["404 User not found"]
    F -- Si --> G["Buscar OTP vigente en Redis"]
    D -- No --> G
    G --> H{"OTP vigente?"}
    H -- Si --> I["Reutilizar OTP"]
    H -- No --> J["Generar OTP y guardar en Redis con TTL"]
    I --> K["Enviar OTP por correo"]
    J --> K
    K --> L["Usuario envia POST /auth/otp/verify"]
    L --> M["Validar OTP, intent y limite de intentos"]
    M --> N{"OTP valido?"}
    N -- No --> X2["400 OTP invalido o expirado"]
    N -- Si --> O{"Intent = REGISTER?"}
    O -- Si --> P["Crear usuario"]
    O -- No --> Q["Cargar usuario existente"]
    P --> R["Crear sesion SID en Redis"]
    Q --> R
    R --> S["Emitir JWT Bearer"]
    S --> T["Retornar token + perfil"]
                `} />
              </div>
            </Card>

            <Card className="p-8 bg-surface-container">
              <h3 className="font-manrope font-black text-xl text-on-surface mb-6 text-secondary flex items-center gap-2"><Icon name="local_shipping" size="sm"/> 4.2 Creación de Envío</h3>
              <div className="bg-white rounded-xl p-4 overflow-hidden border border-outline-variant/20 shadow-sm">
                <MermaidChart chart={`
flowchart TD
    A["POST /shipments"] --> B["Validar JWT / rol"]
    B --> C["Cargar customer y product"]
    C --> D{"Customer existe?"}
    D -- No --> X1["404 Customer not found"]
    D -- Si --> E{"Product existe?"}
    E -- No --> X2["404 Product not found"]
    E -- Si --> F{"warehouse_id o seaport_id?"}
    F -- Ninguno --> X3["400 Debe enviar warehouse_id o seaport_id"]
    F -- Warehouse --> G["Cargar Warehouse"]
    F -- Seaport --> H["Cargar Seaport"]
    G --> I["Calcular shipping_type, ETA, precio base y cargo extra"]
    H --> I
    I --> J{"Ruta valida para el destino?"}
    J -- No --> X4["400 Ruta incompatible con el tipo de envio"]
    J -- Si --> K{"Cantidad > 10?"}
    K -- Si --> L["Aplicar descuento automatico"]
    K -- No --> M["Sin descuento"]
    L --> N["Generar guide_number en Redis"]
    M --> N
    N --> O{"vehicle_plate o fleet_number enviados?"}
    O -- Si --> Q["Usar valor provisto y validado"]
    O -- No --> P{"shipping_type = LAND?"}
    P -- Si --> R["Generar vehicle_plate"]
    P -- No --> S["Generar fleet_number"]
    Q --> T["Persistir Shipment"]
    R --> T
    S --> T
    T --> U["Retornar respuesta"]
                `} />
              </div>
            </Card>

            <Card className="p-8 bg-surface-container">
              <h3 className="font-manrope font-black text-xl text-on-surface mb-6 text-tertiary flex items-center gap-2"><Icon name="admin_panel_settings" size="sm"/> 4.3 Ciclo Administrativo (Estados)</h3>
              <div className="bg-white rounded-xl p-4 overflow-hidden border border-outline-variant/20 shadow-sm">
                <MermaidChart chart={`
flowchart TD
    A["PATCH /shipments/admin/{id}/status"] --> B["Validar rol ADMIN"]
    B --> C["Buscar shipment"]
    C --> D{"Existe?"}
    D -- No --> X1["404 Shipment not found"]
    D -- Si --> E{"Nuevo estado = estado actual?"}
    E -- Si --> R["Retornar shipment actual"]
    E -- No --> F{"Transicion valida?"}
    F -- No --> X2["400 Invalid status transition"]
    F -- Si --> G["Actualizar shipping_status"]
    G --> H["Crear ShipmentStatusLog"]
    H --> I["Persistir cambios"]
    I --> J["Retornar respuesta"]
                `} />
              </div>
            </Card>

          </div>
        </section>

        {/* ════ SECTION 5 — MODELO DE DOMINIO ════ */}
        <section className="space-y-8">
          <div className="text-center">
            <SectionLabel>5. Modelo de Dominio y Reglas</SectionLabel>
            <h2 className="font-manrope font-black text-3xl md:text-4xl text-on-surface mt-2 mb-4">
              Entidades Core
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-primary"><Icon name="person" size="sm"/> User</h3>
              <p className="text-xs text-on-surface-variant mb-2">Usa <code>CITEXT</code> para emails insensibles a mayúsculas. El <code>global_role</code> discrimina ADMIN de USER. Posee un soft-delete (<code>is_active</code>).</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-primary"><Icon name="local_shipping" size="sm"/> Shipment</h3>
              <p className="text-xs text-on-surface-variant mb-2">La entidad central. Relaciona Customer con Product. Genera <code>guide_number</code> de forma atómica usando Redis. Control estricto de edición solo en estado <code>PENDING</code>.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-primary"><Icon name="warehouse" size="sm"/> Warehouse / Seaport</h3>
              <p className="text-xs text-on-surface-variant mb-2">Comparten el servicio <code>LogisticsNodeService</code>. El atributo <code>continent</code> se deriva del país sin interacción del usuario gracias al <code>LocationHelper</code>.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-primary"><Icon name="category" size="sm"/> Product</h3>
              <p className="text-xs text-on-surface-variant mb-2">El catálogo usa Enums para <code>size</code> (S, M, L, XL) y <code>transport_mode</code>. Simplifica profundamente la lógica de precios logísticos.</p>
            </Card>
            <Card className="p-6 lg:col-span-2">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-secondary"><Icon name="rule" size="sm"/> Reglas de Negocio Estrictas</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-on-surface-variant mt-3">
                <li>• Placas terrestres: formato <code>AAA123</code>.</li>
                <li>• Flota marítima: formato <code>AAA1234A</code>.</li>
                <li>• Descuento Terrestre: 5% si cantidad {`> 10`}.</li>
                <li>• Descuento Marítimo: 3% si cantidad {`> 10`}.</li>
                <li>• Obligatorio: Bodega para Terrestre, Puerto para Marítimo.</li>
                <li>• Tracker: Transiciones rígidas <code>PENDING -&gt; SENT -&gt; DELIVERED</code>.</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* ════ SECTION 6 — INFRA Y SEGURIDAD ════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionLabel>6. Persistencia y Observabilidad</SectionLabel>
            <h3 className="font-manrope font-black text-2xl text-on-surface mb-6">Base de Datos y Auditoría</h3>
            <div className="space-y-4">
              <Card className="p-5 border-l-4 border-l-primary">
                <h4 className="font-bold text-sm mb-1">SQLAlchemy Async & Alembic</h4>
                <p className="text-xs text-on-surface-variant">Conexiones no bloqueantes a PostgreSQL. Migraciones en SQL puro (up/down) para absoluto control DDL. UUIDs como Primary Keys.</p>
              </Card>
              <Card className="p-5 border-l-4 border-l-secondary">
                <h4 className="font-bold text-sm mb-1">Observabilidad (Middlewares)</h4>
                <p className="text-xs text-on-surface-variant"><code>RequestInfoMiddleware</code> loguea métricas (IP, Tiempo, Agent). <code>ContextVar</code> permite a la capa inferior conocer qué usuario dispara una consulta.</p>
              </Card>
              <Card className="p-5 border-l-4 border-l-tertiary">
                <h4 className="font-bold text-sm mb-1">Auditoría (Status Log)</h4>
                <p className="text-xs text-on-surface-variant">Los diffs y cambios de Shipment son inmutables en <code>ShipmentStatusLog</code>, garantizando trazabilidad total para administradores.</p>
              </Card>
            </div>
          </div>

          <div>
            <SectionLabel>7. Seguridad</SectionLabel>
            <h3 className="font-manrope font-black text-2xl text-on-surface mb-6">Arquitectura Híbrida</h3>
            <div className="space-y-4">
              <div className="p-5 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                <h4 className="font-bold text-sm mb-3 text-primary flex items-center gap-2"><Icon name="security" size="xs"/> Inclusión de Redis</h4>
                <p className="text-xs text-on-surface-variant mb-2">
                  La decisión de no usar JWT plano radica en la incapacidad de revocarlos prematuramente. Acoplar la firma JWT a una sesión en Redis nos da el mejor de los mundos: stateless en microservicios, pero controlable centralizadamente.
                </p>
                <p className="text-[11px] mt-2 font-medium text-secondary">
                  * También se usa Redis para el caché de perfiles, evitando golpear a PostgreSQL en cada petición protegida.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════ SECTION 7 — EVOLUCIÓN (GOOD TO KNOW) ════ */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Card className="p-10 md:p-14 relative overflow-hidden bg-surface-container-highest shadow-xl border-primary/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start justify-between">
              <div className="max-w-xl">
                <SectionLabel><span className="text-primary">Evolución Arquitectónica</span></SectionLabel>
                <h2 className="font-manrope font-black text-3xl md:text-5xl text-on-surface mt-1 mb-6 leading-tight">
                  Good To Know <br/>
                  <span className="text-on-surface-variant text-2xl md:text-3xl">Decisiones y Trade-offs</span>
                </h2>
                <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                  Como en todo sistema real, se tomaron decisiones equilibrando velocidad y correctitud. Estas áreas fueron descartadas temporalmente pero marcan el <strong>Roadmap</strong> claro si el sistema debe escalar a nivel Enterprise.
                </p>
              </div>

              <div className="w-full md:w-auto flex-grow max-w-md space-y-4">
                <Card className="p-5 hover:border-primary/40 transition-colors">
                  <h4 className="font-bold text-sm text-primary">Paginación a Cursor</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Actualmente se usa Offset (`skip`/`limit`). Si la DB crece masivamente, la paginación por Cursor es obligatoria para rendimiento B-Tree.</p>
                </Card>
                <Card className="p-5 hover:border-primary/40 transition-colors">
                  <h4 className="font-bold text-sm text-primary">Direcciones y Geografía</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Las direcciones son `strings` planos para agilizar el CRUD. En producción, se extraería a un micro-esquema geográfico estandarizado.</p>
                </Card>
                <Card className="p-5 hover:border-primary/40 transition-colors">
                  <h4 className="font-bold text-sm text-primary">Módulo de Inventario</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Atributos como <code>storage_capacity</code> y ocupación real de bodegas se pospusieron. Requiere un engine asíncrono de reservas concurrentes.</p>
                </Card>
                <Card className="p-5 hover:border-primary/40 transition-colors">
                  <h4 className="font-bold text-sm text-primary">Rate Limiting de API</h4>
                  <p className="text-xs text-on-surface-variant mt-1">No implementado en esta entrega. Idealmente gestionado con Redis o a nivel infraestructura (API Gateway).</p>
                </Card>
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
            Arquitectura Backend · FastAPI + Clean Architecture
          </p>
        </div>
      </footer>

    </div>
  );
}
