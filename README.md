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


## Guía de Inicio Rápido

Existen dos formas de ejecutar esta interfaz:

### Opción A: Ejecución con Docker (Recomendada para revisión)
Si tienes Docker instalado, puedes levantar la aplicación en segundos sin preocuparte por las dependencias locales.

1. Asegúrate de que el backend esté corriendo en `http://localhost:8000`.
2. Ejecuta el siguiente comando en la raíz del frontend:
   ```bash
   docker-compose up --build
   ```
3. Accede a la aplicación en `http://localhost:3000`.

### Opción B: Ejecución Local (Desarrollo)
Requiere **Node.js 20+** y **pnpm**.

1. Instalar dependencias:
   ```bash
   pnpm install
   ```
2. Configurar variables de entorno (opcional, usa valores por defecto):
   Crea un archivo `.env` basado en el siguiente valor:
   ```bash
   VITE_API_BASE_URL=http://localhost:8000/api
   NODE_ENV=development
   ```
3. Iniciar servidor de desarrollo:
   ```bash
   pnpm dev
   ```
4. Abrir `http://localhost:5173` en el navegador.

## Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo con HMR.
- `pnpm build`: Genera el bundle de producción en la carpeta `dist/`.
- `pnpm test`: Ejecuta la suite completa de pruebas unitarias (Vitest).
- `pnpm lint`: Ejecuta el linter (ESLint).
- `pnpm preview`: Previsualiza localmente la build de producción.

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

