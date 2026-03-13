import { Page, Locator, expect } from '@playwright/test';

// Page Object que encapsula los selectores y acciones de la pantalla de login
export class LoginPage {
  // ─── Locators ──────────────────────────────────────────────────────────
  readonly formTitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly toggleLogin: Locator;
  readonly toggleRegister: Locator;
  readonly modalOverlay: Locator;
  readonly modalTitle: Locator;
  readonly modalBody: Locator;
  readonly modalBtnClose: Locator;

  constructor(private readonly page: Page) {
    this.formTitle = page.getByTestId('form-title');
    this.emailInput = page.getByTestId('field-email');
    this.passwordInput = page.getByTestId('field-password');
    this.submitButton = page.getByTestId('btn-submit');
    this.toggleLogin = page.getByTestId('toggle-option-0');
    this.toggleRegister = page.getByTestId('toggle-option-1');
    this.modalOverlay = page.getByTestId('modal-overlay');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalBody = page.getByTestId('modal-body');
    this.modalBtnClose = page.getByTestId('modal-btn-close');
  }

  // ─── Navegación ────────────────────────────────────────────────────────

  // Navega a la ruta de login
  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  // Navega a la ruta de login con parámetro de redirección
  async gotoRedirected(): Promise<void> {
    await this.page.goto('/auth/login?redirected=true');
  }

  // Espera a que la pantalla esté completamente cargada
  async waitForReady(): Promise<void> {
    await expect(this.formTitle).toBeVisible();
  }

  // ─── Acciones ──────────────────────────────────────────────────────────

  // Llena el formulario y lo envía
  async fillAndSubmit(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // Obtiene todos los mensajes de error visibles
  getErrorMessages(): Locator {
    return this.page.getByTestId('error-message');
  }
}
