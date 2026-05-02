# SIATA Logistics — Guía de Sistema de Diseño (UI Design System)

> **Propósito:** Este documento describe el sistema de diseño, la colorimetría, tipografía y componentes visuales de SIATA Logistics. Sirve como referencia para replicar la estética premium y la consistencia visual en todos los módulos de la aplicación.

---

## 1. Stack Tecnológico de UI

| Tecnología | Versión | Rol |
|---|---|---|
| **React** | 18 | Framework UI |
| **Tailwind CSS** | v4 | Motor de estilos y utilidades |
| **Material Symbols** | Outlined | Iconografía base |
| **Google Fonts** | Inter & Manrope | Tipografía corporativa |

---

## 2. Colorimetría (Design Tokens)

Los colores se definen mediante variables CSS en `src/index.css`. El sistema soporta **Modo Claro** y **Modo Oscuro** de forma nativa.

### 2.1 Colores Primarios (Brand)
Usados para acciones principales, botones CTA y énfasis de marca.

| Token Tailwind | Variable CSS | Valor HEX (Light) | Uso |
|---|---|---|---|
| `bg-primary` | `--primary-raw` | `#005aa8` | Fondo de botones principales y estados activos |
| `text-primary` | `--primary-raw` | `#005aa8` | Texto de énfasis y enlaces |
| `bg-primary-container`| `--primary-container` | `#1b73cd` | Fondos de contenedores destacados |

### 2.2 Colores de Superficie y Fondo
Definen las capas de profundidad de la aplicación.

| Token Tailwind | Variable CSS | Valor HEX (Light) | Uso |
|---|---|---|---|
| `bg-background` | `--background` | `#f7f9fb` | Fondo principal de la aplicación |
| `bg-surface-container-low` | `--surface-container-low` | `#f2f4f6` | Fondos de cards y elementos contenidos |
| `bg-surface-container-lowest`| `--surface-container-lowest`| `#ffffff` | Fondo de inputs y capas superiores |

### 2.3 Colores de Texto y Bordes

| Token | Uso |
|---|---|
| `text-on-surface` | Texto principal (títulos, párrafos) |
| `text-on-surface-variant` | Texto secundario o descriptivo |
| `text-outline` | Labels, placeholders e iconos en reposo |
| `border-outline-variant/30` | Bordes sutiles para delimitación de cards |
| `text-error` | Mensajes de alerta o estados críticos |

---

## 3. Tipografía

### 3.1 Fuentes Base
- **Manrope:** Reservada exclusivamente para **Títulos** (`h1`–`h6`) y branding. Transmite modernidad y solidez.
- **Inter:** Fuente para **Cuerpo de texto**, inputs, labels y navegación. Maximiza la legibilidad.

### 3.2 Escala Tipográfica

| Elemento | Estilo Tailwind |
|---|---|
| Título de Card (`h1`) | `text-2xl font-manrope font-extrabold tracking-tight` |
| Subtítulos | `text-[13px] leading-relaxed opacity-80` |
| Labels de Input | `text-[10px] font-black uppercase tracking-wider text-outline px-1` |
| Texto de Input | `text-sm font-medium` |
| Botones CTA | `text-[11px] font-black uppercase tracking-widest` |
| Footer / Muted | `text-[10px] font-bold tracking-[0.2em] uppercase opacity-50` |

---

## 4. Componentes y Patrones Visuales

### 4.1 Card "Premium"
El contenedor base para formularios y secciones de contenido.

```tsx
<div className="bg-white border border-outline-variant/30 rounded-2xl p-8 shadow-[0px_10px_40px_rgba(0,0,0,0.08)]">
  {/* Contenido */}
</div>
```
- **Radio de borde:** `rounded-2xl` (16px).
- **Sombra:** Suave y profunda para efecto de elevación.

### 4.2 Campos de Entrada (Inputs)
Siempre acompañados de un label superior y, preferiblemente, un icono a la izquierda.

```tsx
<div className="space-y-1.5">
  <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Label</label>
  <div className="relative group">
    <Icon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
    <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
  </div>
</div>
```

### 4.3 Botón de Acción Principal (CTA)
Botones con feedback táctil y estados de carga.

```tsx
<button className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
  ACCIONAR
</button>
```

---

## 5. Iconografía y Utilidades

### 5.1 Uso del componente `<Icon />`
Se ha implementado un componente utilitario para estandarizar el uso de **Material Symbols Outlined**.

```tsx
import { Icon } from "@/utils/icon";

<Icon name="dashboard" size="xl" />
<Icon name="settings" filled className="text-primary" />
```

### 5.2 Hover con Color Primario Difundido
Para elementos interactivos en listas o navegación (como la Sidebar), el hover debe usar el color primario con opacidad:
- Clase: `hover:bg-primary/10 hover:text-primary`

---

## 6. Animaciones y Micro-interacciones

Se utiliza `tailwindcss-animate` para enriquecer la experiencia de usuario.

| Efecto | Clase Tailwind |
|---|---|
| Entrada Suave | `animate-in fade-in duration-300` |
| Deslizamiento | `animate-in slide-in-from-top-2` |
| Pulsación Táctil | `active:scale-[0.95]` |
| Hover Dinámico | `group-hover:scale-105 transition-transform` |
| Indicador Carga | `animate-spin` (usar con icono `progress_activity`) |

---

## 7. Estructura de Proyecto

Cada nueva funcionalidad debe seguir la arquitectura por módulos:
```
src/features/[modulo]/
├── components/       # Componentes específicos (ej. SidebarHeader)
├── pages/            # Páginas conectadas al router
├── services/         # Lógica de API
└── types/            # Tipos de TypeScript y esquemas
```

---

## 8. Checklist de Revisión de Diseño

Al crear una nueva pantalla, asegúrate de:
- [ ] La fuente base es **Inter** y los títulos son **Manrope**.
- [ ] Los labels son **mayúsculas, negritas y de 10px**.
- [ ] Los inputs tienen el **halo de foco** `ring-primary/5`.
- [ ] Los bordes de las cards son **2xl** (16px) y los de botones/inputs son **xl** (12px).
- [ ] Todos los iconos provienen de **Material Symbols Outlined**.
- [ ] El **Hover** en listas utiliza el azul primario difundido (`bg-primary/10`).
- [ ] La aplicación es completamente funcional tanto en **Light Mode** como en **Dark Mode**.
