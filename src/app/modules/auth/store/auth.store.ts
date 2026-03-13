// Store de autenticación — maneja el estado de sesión del usuario
import { computed } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

// Interfaz del estado de autenticación
export interface AuthState {
  email: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

// Estado inicial
const initialAuthState: AuthState = {
  email: null,
  isAuthenticated: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  // ─── DevTools ──────────────────────────────────────────────────────────
  withDevtools('auth'),

  // ─── Estado inicial ──────────────────────────────────────────────────────
  withState<AuthState>(initialAuthState),

  // ─── Propiedades computadas ──────────────────────────────────────────────
  withComputed((store) => ({
    // Retorna el email del usuario o un string vacío si no está autenticado
    userEmail: computed(() => store.email() ?? ''),
  })),

  // ─── Métodos ─────────────────────────────────────────────────────────────
  withMethods((store) => ({
    // Guarda los datos del usuario al iniciar sesión
    login(email: string): void {
      patchState(store, {
        email,
        isAuthenticated: true,
        error: null,
      });
    },

    // Guarda los datos del usuario al registrarse
    register(email: string): void {
      patchState(store, {
        email,
        isAuthenticated: true,
        error: null,
      });
    },

    // Cierra la sesión y limpia el estado
    logout(): void {
      patchState(store, initialAuthState);
    },

    // Limpia el error del estado
    clearError(): void {
      patchState(store, { error: null });
    },
  }))
);
