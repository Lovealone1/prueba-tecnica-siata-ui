import { useState, useMemo } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModalStore } from "@/store/modal.store";
import { Icon } from "@/utils/icon";
import { useQuery } from "@tanstack/react-query";
import { logisticsService } from "../services/logistics.service";
import type { LogisticsNode, LogisticsNodeType } from "../types/logistics.types";
import { Select } from "@/components/ui/Select";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { cn } from "@/lib/utils";
import { getCountries, getContinents } from "@/utils/location";

export function LogisticsPage() {
  const { onOpen } = useModalStore();
  const [activeTab, setActiveTab] = useState<LogisticsNodeType>("WAREHOUSE");
  const [continent, setContinent] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["logistics", activeTab, continent, country],
    queryFn: () => logisticsService.getNodes(activeTab, 0, 200, continent || undefined, country || undefined),
    staleTime: 1000 * 60 * 5,
  });

  const countryOptions = useMemo(() => [
    { value: "", label: "Todos los países", icon: "all_inclusive" },
    ...getCountries().map(c => ({ value: c, label: c }))
  ], []);

  const continentOptions = useMemo(() => [
    { value: "", label: "Todos los continentes", icon: "all_inclusive" },
    ...getContinents().map(c => ({ value: c, label: c }))
  ], []);

  const columns: Column<LogisticsNode>[] = [
    {
      header: "Nombre",
      accessor: (item) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-on-surface truncate max-w-[200px]" title={item.name}>
            {item.name}
          </span>
          <span className="text-[11px] text-outline truncate max-w-[200px]">
            {item.address}
          </span>
        </div>
      ),
    },
    {
      header: "Ubicación",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <Icon name="location_city" size="xs" className="text-primary/60" />
          <span className="text-sm font-medium">
            {item.city}, {item.country}
          </span>
        </div>
      ),
    },
    {
      header: "Continente",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <Icon name="public" size="xs" className="text-primary/60" />
          <span className="text-sm font-medium">
            {item.continent}
          </span>
        </div>
      ),
    },
    {
      header: "Fecha Registro",
      accessor: (item) => (
        <span className="text-xs text-outline">
          {new Date(item.created_at).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      ),
    },
  ];

  const filters = (
    <div className="flex items-center gap-2">
      <div className="w-48">
        <Select
          size="sm"
          placeholder="Continente: Todos"
          value={continent}
          onChange={setContinent}
          icon="public"
          options={continentOptions}
        />
      </div>
      <div className="w-48">
        <SearchableSelect
          size="sm"
          placeholder="País: Todos"
          value={country}
          onChange={setCountry}
          icon="flag"
          options={countryOptions}
        />
      </div>
      {(continent || country) && (
        <button 
          onClick={() => {
            setContinent("");
            setCountry("");
          }}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-all whitespace-nowrap"
        >
          <Icon name="filter_alt_off" size="sm" />
          <span>Limpiar Filtros</span>
        </button>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="bg-error/10 border border-error/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <Icon name="error" className="text-4xl text-error mb-3" />
        <h3 className="text-lg font-bold text-error">Error al cargar datos</h3>
        <p className="text-sm text-error/80 mt-1">
          No se pudo obtener la lista de {activeTab === "WAREHOUSE" ? "bodegas" : "puertos"}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex bg-surface-container-low p-1.5 rounded-2xl w-fit border border-outline-variant/20 shadow-sm">
        <button
          onClick={() => setActiveTab("WAREHOUSE")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            activeTab === "WAREHOUSE" 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "text-outline hover:text-on-surface hover:bg-outline-variant/10"
          )}
        >
          <Icon name="warehouse" size="sm" />
          <span>Bodegas</span>
        </button>
        <button
          onClick={() => setActiveTab("SEAPORT")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            activeTab === "SEAPORT" 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "text-outline hover:text-on-surface hover:bg-outline-variant/10"
          )}
        >
          <Icon name="sailing" size="sm" />
          <span>Puertos</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pageSize={6}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder={activeTab === "WAREHOUSE" ? "Buscar bodegas..." : "Buscar puertos..."}
        filters={filters}
        onAdd={() => onOpen("CREATE_LOGISTICS", { location_type: activeTab })}
        addLabel={activeTab === "WAREHOUSE" ? "Nueva Bodega" : "Nuevo Puerto"}
        onEdit={(item) => onOpen("EDIT_LOGISTICS", { ...item, location_type: activeTab })}
        onDelete={(item) => onOpen("DELETE_LOGISTICS", { ...item, location_type: activeTab })}
        onView={(item) => onOpen("VIEW_LOGISTICS", { ...item, location_type: activeTab })}
      />
    </div>
  );
}
