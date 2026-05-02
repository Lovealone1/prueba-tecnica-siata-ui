# Frontend CRUD Module Guide

Esta guía detalla el patrón estándar para implementar módulos CRUD en el frontend de la aplicación, asegurando consistencia en la UI, manejo de caché eficiente y una experiencia de usuario fluida.

## 1. Estructura de Archivos
Cada módulo debe seguir la siguiente estructura dentro de `src/features/`:

```text
features/<modulo>/
├── components/          # Componentes específicos del módulo
├── pages/
│   └── <Entity>ListPage.tsx  # Página principal con la tabla
├── services/
│   └── <entity>.service.ts  # Servicio que extiende de BaseService
└── types/
    └── <entity>.types.ts    # Esquemas Zod e interfaces TypeScript
```

## 2. Estrategia de Datos y Caché
Utilizamos **TanStack Query (React Query)** para la gestión de estado asíncrono.

### Carga de Datos
Para permitir búsqueda instantánea y paginación fluida sin saturar el backend, seguimos este patrón:
- **Carga Masiva Inicial**: Se solicita un set de datos grande (ej. 200 registros) en lugar de paginar por servidor de 7 en 7.
- **Caché (staleTime)**: Se configura un `staleTime` de 5 minutos para evitar peticiones innecesarias al navegar.

```typescript
// Ejemplo en ListPage.tsx
const { data, isLoading } = useQuery({
  queryKey: ["entities"],
  queryFn: () => service.getAll(0, 200),
  staleTime: 1000 * 60 * 5, // 5 minutos
});
```

## 3. Componente DataTable
El componente `DataTable` es genérico y maneja la lógica de visualización, búsqueda y paginación local.

### Props Clave:
- `data`: El array de datos obtenido del API.
- `pageSize`: Fijado en **7** para mantener la consistencia visual pedida por el usuario.
- `searchKey`: El campo por el cual se realizará el filtrado local (ej. "name").

```tsx
<DataTable
  columns={columns}
  data={data?.data || []}
  pageSize={7}
  isLoading={isLoading}
  searchKey="name"
  searchPlaceholder="Buscar..."
  onAdd={() => onOpen("CREATE_ENTITY")}
  onEdit={(item) => onOpen("EDIT_ENTITY", item)}
/>
```

## 4. Paginación y Búsqueda Local
- **Hook `usePagination`**: La `DataTable` utiliza internamente `usePagination.ts` para calcular los cortes de datos (`.slice()`) y los metadatos de la UI (páginas, índices).
- **Búsqueda**: Se realiza de forma reactiva en el cliente sobre el total de datos cargados (los 200 registros), permitiendo encontrar elementos que no están en la página actual sin latencia de red.

## 5. Sincronización de Datos (Invalidación)
Para asegurar que la tabla se actualice tras crear, editar o eliminar, se debe invalidar la caché en el `onSuccess` de las mutaciones dentro de los formularios.

```typescript
// En el Formulario (Modal)
const mutation = useMutation({
  mutationFn: (data) => service.create(data),
  onSuccess: () => {
    // Invalida todas las queries que empiecen por "entities"
    queryClient.invalidateQueries({ queryKey: ["entities"] });
    toast.success("Operación exitosa");
    onClose();
  },
});
```

## 6. Mejores Prácticas
1. **Zod Schemas**: Definir siempre el esquema de validación en `.types.ts` y usarlo con `zodResolver` en los formularios.
2. **Iconografía**: Usar el componente `<Icon />` (Material Symbols) para mantener la estética consistente.
3. **Skeleton/Loading**: La `DataTable` ya maneja un estado de carga interno; no es necesario ocultar toda la página con un spinner global.
