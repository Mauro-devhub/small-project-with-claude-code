import { Page, Locator, expect } from '@playwright/test';

// Page Object que encapsula los selectores y acciones de la página Home del dashboard
export class HomePage {
  // ─── Locators ──────────────────────────────────────────────────────────
  readonly homeContainer: Locator;
  readonly homeContent: Locator;
  readonly dashboardHeader: Locator;
  readonly welcomeMessage: Locator;
  readonly menuButton: Locator;
  readonly avatarButton: Locator;

  constructor(private readonly page: Page) {
    this.homeContainer = page.getByTestId('home-container');
    this.homeContent = page.getByTestId('home-content');
    this.dashboardHeader = page.getByTestId('dashboard-header');
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.menuButton = page.getByTestId('btn-menu');
    this.avatarButton = page.getByTestId('btn-avatar');
  }

  // ─── Navegación ────────────────────────────────────────────────────────

  // Realiza login y navega al home del dashboard
  async loginAndGoto(email: string, password: string): Promise<void> {
    await this.page.goto('/auth/login');
    await this.page.getByTestId('field-email').fill(email);
    await this.page.getByTestId('field-password').fill(password);
    await this.page.getByTestId('btn-submit').click();
    await this.page.waitForURL(/\/dashboard\/home/);
  }

  // Navega directamente al home (sin autenticación previa)
  async goto(): Promise<void> {
    await this.page.goto('/dashboard/home');
  }

  // Espera a que la pantalla esté completamente cargada
  async waitForReady(): Promise<void> {
    await expect(this.dashboardHeader).toBeVisible();
  }
}
