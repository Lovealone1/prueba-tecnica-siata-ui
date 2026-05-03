# SIATA Logistics UI

Frontend SPA para la gestion logistica de envios terrestres y maritimos. Este repositorio contiene la capa de interfaz, el enrutamiento, el estado de cliente, la capa de servicios y los componentes reutilizables que consumen la API REST del backend.

## Alcance

- Aplicacion construida con React + TypeScript + Vite.
- Autenticacion por OTP con persistencia de sesion.
- Control de acceso por roles para usuario y administrador.
- CRUD de clientes, productos, bodegas, puertos, envios y usuarios.
- Capa visual basada en Tailwind CSS, CSS variables y componentes reutilizables.

## Descripción general de la arquitectura

- `src/main.tsx` inicializa la app y envuelve todos los proveedores globales.
- `src/app/router.tsx` define las rutas publicas, privadas y administrativas.
- `src/store/` concentra el estado de cliente con Zustand.
- `src/services/` y `src/features/*/services/` encapsulan el acceso a API.
- `src/components/ui/` contiene componentes genericos de UI.
- `src/features/` organiza la funcionalidad por dominio.


## Requisitos de entorno

- Node.js 20+ recomendado.
- pnpm para instalar y ejecutar dependencias.
- Variable de entorno:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

## Rutas principales

- `/` landing page y entrada a la documentacion funcional.
- `/auth/login` inicio de sesion o registro por OTP.
- `/auth/otp` verificacion de codigo.
- `/dashboard` panel principal para usuario autenticado.
- `/admin` panel administrativo.

## Notas de implementacion

- El frontend usa React Query para estado asincrono y cache.
- El token se agrega automaticamente mediante un interceptor de Axios.
- Los modales globales se resuelven desde una unica store.
- El tema claro/oscuro se persiste en localStorage.

