---
name: angular-ui-architecture
description:
  Genera y agrega elementos de UI (componentes, servicios, modelos, enums, dtos y utilidades)
  siguiendo la arquitectura definida para proyectos Angular 19+ con standalone components.
  Usa esta skill cuando el usuario pida crear componentes, módulos, servicios, pantallas,
  formularios, vistas, páginas, elementos visuales, o cualquier pieza de UI/lógica en Angular.
  También aplica cuando se mencione agregar features, flows, secciones o cualquier elemento
  que deba vivir dentro de src/app/modules. Actívala incluso si la solicitud es vaga como
  "crea la pantalla de login" o "agrega un componente de tabla reutilizable".
---

# Angular UI Architecture Skill

Skill encargada de crear y agregar elementos de UI en proyectos Angular 19.2.0+,
respetando la arquitectura modular definida para el proyecto.

---

## Reglas generales

- **Idioma del código**: Todo el código, nombres de archivos, clases, variables y métodos se escriben en **inglés**.
- **Idioma de los comentarios**: Todos los comentarios dentro del código se escriben en **español**.
- **Framework**: Angular 19.2.0 con **standalone components** (sin NgModules).
- **Raíz de módulos**: Todo vive dentro de `src/app/modules/`.

---

## Estructura de módulos

Cada módulo representa una pantalla o conjunto de flujos relacionados a un mismo fin.
```
src/app/modules/[name-module]/
├── [name-module].component.ts
├── [name-module].component.html
├── [name-module].component.scss
├── pages/
│   └── [page-name]/
│       ├── [page-name].component.ts
│       ├── [page-name].component.html
│       └── [page-name].component.scss
├── services/
│   └── [name-module].service.ts
├── components/
│   └── [name-component]/
│       ├── [name-component].component.ts
│       ├── [name-component].component.html
│       └── [name-component].component.scss
├── models/
│   └── [name-model].model.ts
├── enums/
│   └── [name-enum].enum.ts
└── dtos/
    └── [name-dto].dto.ts
└── store/
    └── [name-module].store.ts
```

> Los archivos y subcarpetas se crean **bajo demanda** según lo que el módulo necesite.
> No crear carpetas vacías si no hay contenido para ellas.

---

## Módulos de ejemplo

| Módulo | Ruta |
|--------|------|
| Autenticación | `src/app/modules/auth/` |
| Dashboard | `src/app/modules/dashboard/` |

---

## Componentes compartidos

Los componentes **reutilizables en todo el proyecto** deben vivir en:
```
src/app/modules/shared/components/[name-component]/
├── [name-component].component.ts
├── [name-component].component.html
└── [name-component].component.scss
```

Los componentes **exclusivos de un módulo** se colocan dentro del propio módulo:
```
src/app/modules/[name-module]/components/[name-component]/
```

---

## Utilidades de terceros

Las funcionalidades de librerías externas que no corresponden a un módulo específico deben vivir en:
```
src/app/modules/utils/[library-name]/[library-name].utils.ts
```

**Ejemplos:**
```
src/app/modules/utils/date-fns/date-fns.utils.ts
src/app/modules/utils/crypto-js/crypto-js.utils.ts
```

---

## Convenciones de nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Carpetas | `kebab-case` | `auth`, `user-profile` |
| Archivos | `kebab-case` | `auth.component.ts` |
| Clases | `PascalCase` | `AuthComponent` |
| Servicios | `PascalCase` + sufijo `Service` | `AuthService` |
| Modelos | `PascalCase` + sufijo `Model` | `UserModel` |
| Enums | `PascalCase` + sufijo `Enum` | `RoleEnum` |
| DTOs | `PascalCase` + sufijo `Dto` | `LoginRequestDto` |
| Variables/métodos | `camelCase` | `getUserById()` |

---

## Standalone Component — Plantilla base
```typescript
// Componente standalone de ejemplo siguiendo la arquitectura del proyecto
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-[name]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[name].component.html',
  styleUrl: './[name].component.scss'
})
export class [Name]Component {
  // Lógica del componente
}
```

---

## Estado del módulo — NgRx Signals Store

Cada módulo que requiera manejo de estado tendrá una carpeta `store/` dentro de su raíz:
```
src/app/modules/[name-module]/store/
└── [name-module].store.ts
```

El manejo de estado completo (definición, CRUDs, efectos) se rige por la skill
**ngrx-signals-store**. Consultar esa skill para la implementación detallada.

---

## Estilos — Variables SCSS globales

Todos los colores, tipografías, tamaños de fuente, pesos, espaciados y cualquier valor
de diseño reutilizable deben definirse como **variables SCSS globales** y nunca hardcodearse
dentro de los archivos `.component.scss` de cada componente.

### Archivo de variables globales

Las variables globales deben vivir en:
```
src/styles/
├── _variables.scss   ← colores, tipografía, breakpoints, espaciados, etc.
├── _mixins.scss      ← mixins reutilizables (opcional)
└── styles.scss       ← archivo principal que importa todo lo anterior
```

El archivo `_variables.scss` debe estar importado en `styles.scss` para que esté
disponible globalmente sin necesidad de importarlo en cada componente.
```scss
// src/styles/styles.scss
@use 'variables' as *;
```

### Convenciones de variables SCSS

| Categoría | Prefijo | Ejemplo |
|-----------|---------|---------|
| Colores primarios | `$color-primary-` | `$color-primary-500` |
| Colores neutros | `$color-neutral-` | `$color-neutral-100` |
| Colores de estado | `$color-` | `$color-error`, `$color-success` |
| Fuentes (familia) | `$font-family-` | `$font-family-base` |
| Fuentes (tamaño) | `$font-size-` | `$font-size-sm`, `$font-size-lg` |
| Fuentes (peso) | `$font-weight-` | `$font-weight-bold` |
| Espaciados | `$spacing-` | `$spacing-4`, `$spacing-8` |
| Bordes | `$border-radius-` | `$border-radius-md` |
| Sombras | `$shadow-` | `$shadow-card` |
| Breakpoints | `$breakpoint-` | `$breakpoint-md` |

### Ejemplo de `_variables.scss`
```scss
// ─── Colores ───────────────────────────────────────────────────────────────
$color-primary-300:   #7B9CFF;
$color-primary-500:   #3D6FFF;
$color-primary-700:   #1A4ACC;

$color-neutral-100:   #F5F5F5;
$color-neutral-400:   #9E9E9E;
$color-neutral-900:   #212121;

$color-error:         #E53935;
$color-success:       #43A047;
$color-warning:       #FB8C00;

// ─── Tipografía ────────────────────────────────────────────────────────────
$font-family-base:    'Inter', sans-serif;
$font-family-mono:    'Fira Code', monospace;

$font-size-xs:        0.75rem;   // 12px
$font-size-sm:        0.875rem;  // 14px
$font-size-base:      1rem;      // 16px
$font-size-lg:        1.125rem;  // 18px
$font-size-xl:        1.25rem;   // 20px
$font-size-2xl:       1.5rem;    // 24px

$font-weight-regular: 400;
$font-weight-medium:  500;
$font-weight-bold:    700;

$line-height-base:    1.5;
$line-height-tight:   1.25;

// ─── Espaciados ────────────────────────────────────────────────────────────
$spacing-1:  0.25rem;
$spacing-2:  0.5rem;
$spacing-4:  1rem;
$spacing-6:  1.5rem;
$spacing-8:  2rem;
$spacing-12: 3rem;

// ─── Bordes ────────────────────────────────────────────────────────────────
$border-radius-sm:    4px;
$border-radius-md:    8px;
$border-radius-lg:    16px;
$border-radius-full:  9999px;

// ─── Sombras ───────────────────────────────────────────────────────────────
$shadow-card:   0 2px 8px rgba(0, 0, 0, 0.08);
$shadow-modal:  0 8px 32px rgba(0, 0, 0, 0.16);

// ─── Breakpoints ───────────────────────────────────────────────────────────
$breakpoint-sm:  576px;
$breakpoint-md:  768px;
$breakpoint-lg:  992px;
$breakpoint-xl:  1200px;
```

### Uso en componentes

Los archivos `.component.scss` deben **consumir** las variables, nunca redefinirlas:
```scss
// ✅ Correcto — consume variables globales
.card {
  background-color: $color-neutral-100;
  border-radius:    $border-radius-md;
  box-shadow:       $shadow-card;
  padding:          $spacing-4;
  font-family:      $font-family-base;
  font-size:        $font-size-base;
  color:            $color-neutral-900;
}

// ❌ Incorrecto — valor hardcodeado
.card {
  background-color: #F5F5F5;
  border-radius:    8px;
  font-size:        16px;
}
```

> Si durante la generación de un componente se necesita un valor de diseño que aún
> no existe como variable, se debe **primero declarar la variable en `_variables.scss`**
> y luego consumirla en el componente.

## Checklist antes de generar un elemento

1. ¿Es un componente reutilizable? → `modules/shared/components/`
2. ¿Es un componente exclusivo de un módulo? → `modules/[name-module]/components/`
3. ¿Es una utilidad de librería externa? → `modules/utils/[library-name]/`
4. ¿Pertenece a un módulo concreto (servicio, modelo, enum, dto)? → `modules/[name-module]/[subcarpeta]/`
5. ¿Requiere crear el módulo raíz primero? → Crear `[name-module].component.ts/html/scss` primero.

---

## Notas adicionales

- Siempre usar `standalone: true` en todos los componentes.
- No usar `NgModule` en ninguna parte del proyecto.
- Los `imports` de cada componente standalone deben declararse explícitamente en el decorador `@Component`.
- Los servicios se proveen con `providedIn: 'root'` salvo indicación contraria.