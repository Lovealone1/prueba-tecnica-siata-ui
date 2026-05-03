import { useQuery } from "@tanstack/react-query";
import { useAuthUser } from "@/store/auth.store";
import { reportService, type DashboardReport } from "../services/report.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// ── Helper components ─────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
  sublabel,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  sublabel?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-card rounded-xl border border-outline-variant/30 shadow-sm p-4 flex flex-col justify-center gap-1 group hover:shadow-md transition-all duration-300 h-full`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-base">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 leading-none mb-1">
          {label}
        </p>
        <p className="text-xl font-black text-on-surface font-manrope leading-none">{value}</p>
        {sublabel && (
          <p className="text-[9px] text-outline mt-1 font-medium">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: "Pendiente", color: "text-amber-500 bg-amber-500/10", icon: "schedule" },
  SENT: { label: "En tránsito", color: "text-blue-500 bg-blue-500/10", icon: "local_shipping" },
  DELIVERED: { label: "Entregado", color: "text-emerald-500 bg-emerald-500/10", icon: "check_circle" },
};

const TYPE_CONFIG: Record<string, { label: string; icon: string }> = {
  LAND: { label: "Terrestre", icon: "directions_car" },
  MARITIME: { label: "Marítimo", icon: "directions_boat" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-surface-container text-on-surface", icon: "info" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${cfg.color}`}>
      <span className="material-symbols-outlined text-[9px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-outline-variant/30 p-4 animate-pulse h-full">
      <div className="w-8 h-8 rounded-lg bg-outline-variant/20 mb-2" />
      <div className="h-2 w-16 bg-outline-variant/20 rounded mb-1" />
      <div className="h-5 w-12 bg-outline-variant/20 rounded" />
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export function DashboardPage() {
  const user = useAuthUser();

  const { data, isLoading, isError } = useQuery<DashboardReport>({
    queryKey: ["dashboard-report"],
    queryFn: () => reportService.getDashboardStats(),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });

  const totalRevenue = data?.shipment_stats.total_revenue ?? 0;
  const statusCounts = data?.shipment_stats.status_counts;
  const topDestinations = data?.shipment_stats.top_destinations ?? [];
  const recentShipments = data?.recent_shipments ?? [];
  const totalShipments = data?.shipment_stats.total_shipments ?? 0;

  return (
    <div className="pt-2 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── TOP KPI ROW (6 Cards) ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon="groups" label="Clientes" value={data?.total_customers ?? 0} color="text-primary bg-primary/10" />
            <StatCard icon="inventory_2" label="Productos" value={data?.total_products ?? 0} color="text-secondary bg-secondary/10" />
            <StatCard icon="warehouse" label="Bodegas" value={data?.total_warehouses ?? 0} color="text-amber-500 bg-amber-500/10" />
            <StatCard icon="anchor" label="Puertos" value={data?.total_seaports ?? 0} color="text-blue-500 bg-blue-500/10" />
            <StatCard icon="pending_actions" label="Pendientes" value={statusCounts?.PENDING ?? 0} color="text-amber-500 bg-amber-500/10" />
            <StatCard icon="done_all" label="Entregados" value={statusCounts?.DELIVERED ?? 0} color="text-emerald-500 bg-emerald-500/10" />
          </>
        )}
      </div>

      {/* ── ROW 2: First KPI + Status Distribution (Perfectly Aligned) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        <div className="lg:col-span-1 h-[110px]">
          <StatCard
            icon="local_shipping"
            label="Envíos Totales"
            value={totalShipments}
            color="text-primary bg-primary/10"
            sublabel="Actividad global"
          />
        </div>
        
        <div className="lg:col-span-3 bg-card rounded-xl border border-outline-variant/30 p-4 shadow-sm flex flex-col justify-center h-[110px]">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-outline mb-3">Distribución por Estado</h3>
          <div className="grid grid-cols-3 gap-6">
            {(["PENDING", "SENT", "DELIVERED"] as const).map((status) => {
              const count = statusCounts?.[status] ?? 0;
              const pct = totalShipments > 0 ? Math.round((count / totalShipments) * 100) : 0;
              const cfg = STATUS_CONFIG[status];
              return (
                <div key={status} className="flex flex-col justify-center gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-on-surface flex items-center gap-2">
                      <span className={`material-symbols-outlined text-base ${cfg.color.split(" ")[0]}`}>{cfg.icon}</span>
                      {cfg.label}
                    </span>
                    <span className="font-black text-on-surface">{count}</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${status === 'PENDING' ? 'bg-amber-500' : status === 'SENT' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Second KPI + Recent Shipments Table Start ─────────── */}
      {/* ── ROW 4: Destinations + Table Continue ───────────────────────── */}
      {/* To achieve this, we use a single grid for the rest of the body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        
        {/* Left Column Stack: Ingresos + Destinations */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="h-[110px]">
            <StatCard
              icon="payments"
              label="Ingresos Totales"
              value={`$${totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
              color="text-emerald-500 bg-emerald-500/10"
              sublabel="Acumulado"
            />
          </div>
          
          <div className="bg-card rounded-xl border border-outline-variant/30 p-5 shadow-sm flex-grow flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-outline mb-6">Principales Destinos</h3>
            <div className="space-y-5 flex-grow">
              {topDestinations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-outline gap-2 opacity-50 py-10">
                  <span className="material-symbols-outlined text-3xl">public_off</span>
                  <p className="text-[10px] italic font-bold">Sin datos operativos</p>
                </div>
              ) : (
                topDestinations.map((dest, idx) => {
                  const maxCount = topDestinations[0]?.count ?? 1;
                  const itemPct = Math.round((dest.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface truncate flex items-center gap-2">
                          <span className="text-[10px] font-black text-outline">{idx + 1}</span>
                          {dest.country}
                        </span>
                        <span className="text-xs font-black text-primary">{dest.count}</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-1">
                        <div className="h-1 rounded-full bg-primary/40" style={{ width: `${itemPct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/10 space-y-2">
              <div className="flex items-center gap-2 bg-primary/5 p-2 rounded-lg border border-primary/10">
                <span className="material-symbols-outlined text-primary text-base">language</span>
                <p className="text-[9px] text-on-surface-variant font-medium leading-tight">
                  <span className="font-bold text-primary mr-1 uppercase">Alcance:</span>
                  Cobertura global del <span className="font-black text-primary">84%</span> en rutas activas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Shipments Table (Alinged with Row 3 and 4) */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest/50">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-outline">Registro de Envíos Recientes</h3>
            <a href="/dashboard/shipments" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
              Ver todos <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </a>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low/30 text-[10px] font-black uppercase tracking-widest text-outline">
                <tr>
                  <th className="px-5 py-4">Guía</th>
                  <th className="px-5 py-4">Transporte</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Total</th>
                  <th className="px-5 py-4 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentShipments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-outline text-xs italic">No hay envíos registrados</td>
                  </tr>
                ) : (
                  recentShipments.map((s) => {
                    const typeCfg = TYPE_CONFIG[s.shipping_type] ?? { label: s.shipping_type, icon: "local_shipping" };
                    return (
                      <tr key={s.guide_number} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-5 py-4 font-mono text-[10px] font-bold text-on-surface-variant group-hover:text-primary">{s.guide_number}</td>
                        <td className="px-5 py-4 text-[11px] text-on-surface-variant">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">{typeCfg.icon}</span>
                            {typeCfg.label}
                          </div>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={s.shipping_status} /></td>
                        <td className="px-5 py-4 text-right text-xs font-black text-on-surface">${Number(s.total_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className="px-5 py-4 text-right text-[10px] text-outline font-bold">{format(new Date(s.registry_date), "dd MMM yyyy", { locale: es })}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isError && (
        <div className="bg-error/5 border border-error/20 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-error">warning</span>
          <p className="text-xs font-bold text-error">Error al sincronizar datos</p>
        </div>
      )}
    </div>
  );
}
