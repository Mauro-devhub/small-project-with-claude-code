---
name: ngrx-signals-store
description:
  Genera y estructura el manejo de estado con NgRx SignalStore (@ngrx/signals) siguiendo
  un patrón único y consistente para operaciones CRUD en proyectos Angular 19+.
  Usa esta skill cuando el usuario pida manejar estado, crear un store, agregar efectos,
  conectar un servicio al estado, manejar listas de datos, loading states, errores,
  paginación, o cualquier flujo reactivo dentro de un módulo. También aplica cuando
  se mencionen palabras como: store, estado, signals, slice, actions, effects, o CRUD
  de entidades. Actívala incluso si la solicitud es vaga como "maneja el estado del
  módulo de usuarios" o "agrega el store para productos".
---

# NgRx Signals Store Skill

Skill encargada de definir e implementar el manejo de estado con `@ngrx/signals`
siguiendo un patrón único y consistente para todos los módulos del proyecto.

---

## Dependencias requeridas
```bash
npm install @ngrx/signals
```

---

## Ubicación del store

Cada store vive dentro de su módulo correspondiente:
```
src/app/modules/[name-module]/store/
└── [name-module].store.ts
```

Un módulo tiene **un único store**. Si la complejidad crece, se divide en
features dentro del mismo archivo usando `withState` adicionales, no en múltiples stores.

---

## Patrón CRUD — Estructura única obligatoria

Todo store que maneje una entidad con operaciones CRUD debe seguir exactamente
este patrón. No se debe alterar la nomenclatura ni la estructura de las secciones.

### Estado base (State interface)
```typescript
// Interfaz que define la forma del estado para la entidad
export interface [Entity]State {
  items:       [Entity]Model[];   // lista principal de entidades
  selectedItem: [Entity]Model | null; // entidad seleccionada para detalle/edición
  isLoading:   boolean;          // indicador de carga global
  isSaving:    boolean;          // indicador de guardado (create/update)
  isDeleting:  boolean;          // indicador de eliminación
  error:       string | null;    // mensaje de error global
}
```

### Estado inicial
```typescript
// Valores iniciales del estado de la entidad
const initial[Entity]State: [Entity]State = {
  items:        [],
  selectedItem: null,
  isLoading:    false,
  isSaving:     false,
  isDeleting:   false,
  error:        null,
};
```

### Store completo — Plantilla CRUD
```typescript
import { inject }                        from '@angular/core';
import { signalStore, withState,
         withMethods, patchState,
         withComputed }                  from '@ngrx/signals';
import { rxMethod }                      from '@ngrx/signals/rxjs-interop';
import { tapResponse }                   from '@ngrx/operators';
import { pipe, switchMap, tap }          from 'rxjs';
import { computed }                      from '@angular/core';
import { [Entity]Service }               from '../services/[name-module].service';
import { [Entity]Model }                 from '../models/[name-module].model';
import { [Entity]State, initial[Entity]State } from './[name-module].store';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export const [Entity]Store = signalStore(
  { providedIn: 'root' },

  // ─── DevTools ──────────────────────────────────────────────────────────
  withDevtools('[Entity]'),

  // ─── Estado inicial ──────────────────────────────────────────────────────
  withState<[Entity]State>(initial[Entity]State),

  // ─── Propiedades computadas ──────────────────────────────────────────────
  withComputed((store) => ({
    // Retorna true si no hay items cargados y no está cargando
    isEmpty: computed(() => !store.isLoading() && store.items().length === 0),

    // Retorna el total de items en el estado
    totalItems: computed(() => store.items().length),
  })),

  // ─── Métodos CRUD ────────────────────────────────────────────────────────
  withMethods((store, service = inject([Entity]Service)) => ({

    // Carga todos los items desde el backend
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          service.getAll().pipe(
            tapResponse({
              next:  (items) => patchState(store, { items, isLoading: false }),
              error: (err: Error) =>
                patchState(store, { isLoading: false, error: err.message }),
            })
          )
        )
      )
    ),

    // Carga un item por su id y lo establece como seleccionado
    loadById: rxMethod<string | number>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          service.getById(id).pipe(
            tapResponse({
              next:  (selectedItem) =>
                patchState(store, { selectedItem, isLoading: false }),
              error: (err: Error) =>
                patchState(store, { isLoading: false, error: err.message }),
            })
          )
        )
      )
    ),

    // Crea un nuevo item y lo agrega a la lista local
    create: rxMethod<Partial<[Entity]Model>>(
      pipe(
        tap(() => patchState(store, { isSaving: true, error: null })),
        switchMap((payload) =>
          service.create(payload).pipe(
            tapResponse({
              next: (newItem) =>
                patchState(store, {
                  items:    [...store.items(), newItem],
                  isSaving: false,
                }),
              error: (err: Error) =>
                patchState(store, { isSaving: false, error: err.message }),
            })
          )
        )
      )
    ),

    // Actualiza un item existente en la lista local
    update: rxMethod<{ id: string | number; payload: Partial<[Entity]Model> }>(
      pipe(
        tap(() => patchState(store, { isSaving: true, error: null })),
        switchMap(({ id, payload }) =>
          service.update(id, payload).pipe(
            tapResponse({
              next: (updated) =>
                patchState(store, {
                  // Reemplaza el item actualizado en la lista
                  items:    store.items().map((i) => (i.id === id ? updated : i)),
                  isSaving: false,
                }),
              error: (err: Error) =>
                patchState(store, { isSaving: false, error: err.message }),
            })
          )
        )
      )
    ),

    // Elimina un item de la lista local por su id
    remove: rxMethod<string | number>(
      pipe(
        tap(() => patchState(store, { isDeleting: true, error: null })),
        switchMap((id) =>
          service.delete(id).pipe(
            tapResponse({
              next: () =>
                patchState(store, {
                  // Filtra el item eliminado de la lista
                  items:      store.items().filter((i) => i.id !== id),
                  isDeleting: false,
                }),
              error: (err: Error) =>
                patchState(store, { isDeleting: false, error: err.message }),
            })
          )
        )
      )
    ),

    // Establece manualmente el item seleccionado (para abrir detalle/modal)
    selectItem(item: [Entity]Model | null): void {
      patchState(store, { selectedItem: item });
    },

    // Limpia el error del estado
    clearError(): void {
      patchState(store, { error: null });
    },

    // Resetea el estado completo al valor inicial
    reset(): void {
      patchState(store, initial[Entity]State);
    },
  }))
);
```

---

## Consumo del store en un componente
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { [Entity]Store }             from '../store/[name-module].store';

@Component({
  selector:    'app-[name-module]',
  standalone:  true,
  templateUrl: './[name-module].component.html',
  styleUrl:    './[name-module].component.scss',
})
export class [Name]Component implements OnInit {

  // Inyección del store como fuente única de verdad
  protected readonly store = inject([Entity]Store);

  ngOnInit(): void {
    // Dispara la carga inicial al montar el componente
    this.store.loadAll();
  }
}
```
```html
<!-- Indicador de carga mientras se obtienen los datos -->
@if (store.isLoading()) {
  <p>Cargando...</p>
}

<!-- Mensaje cuando no hay items disponibles -->
@if (store.isEmpty()) {
  <p>No hay elementos registrados.</p>
}

<!-- Lista de items renderizada desde el estado -->
@for (item of store.items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- Mensaje de error si ocurre algún fallo -->
@if (store.error()) {
  <p class="error">{{ store.error() }}</p>
}
```

---

## Reglas del patrón

| Regla | Detalle |
|-------|---------|
| **Un store por módulo** | Nunca crear múltiples stores para el mismo módulo |
| **Sin lógica en componentes** | Toda la lógica async vive en el store vía `rxMethod` |
| **`patchState` siempre** | Nunca mutar el estado directamente |
| **Indicadores separados** | `isLoading`, `isSaving`, `isDeleting` son siempre independientes |
| **Error centralizado** | Siempre capturar y exponer el error en el estado |
| **`providedIn: 'root'`** | Todos los stores se proveen en root salvo indicación contraria |
| **Nombres consistentes** | `loadAll`, `loadById`, `create`, `update`, `remove` son los nombres estándar |

---

## Extensiones opcionales

Si el módulo requiere funcionalidades adicionales se pueden agregar dentro del mismo
`withMethods`, nunca en stores separados:

- **Paginación**: agregar `page`, `pageSize`, `totalCount` al state.
- **Filtros**: agregar `filters: FilterDto | null` al state.
- **Selección múltiple**: agregar `selectedIds: (string | number)[]` al state.
- **Optimistic updates**: actualizar la lista antes de la respuesta del servidor
  y revertir en caso de error.