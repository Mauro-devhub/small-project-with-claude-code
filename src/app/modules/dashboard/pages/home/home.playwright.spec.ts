import { test, expect } from '@playwright/test';
import { HomePage } from './home.page';

test.describe('HomeComponent', () => {
  const testEmail = 'usuario@test.com';
  const testPassword = '123456';
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.loginAndGoto(testEmail, testPassword);
    await homePage.waitForReady();
  });

  // ─── Renderizado inicial ─────────────────────────────────────────────

  test('debe renderizar la página home correctamente', async () => {
    // Assert
    await expect(homePage.homeContainer).toBeVisible();
    await expect(homePage.dashboardHeader).toBeVisible();
    await expect(homePage.homeContent).toBeVisible();
  });

  test('debe mostrar el mensaje de bienvenida con el email del usuario', async () => {
    // Assert
    await expect(homePage.welcomeMessage).toBeVisible();
    await expect(homePage.welcomeMessage).toContainText(testEmail);
  });

  test('debe mostrar el texto Welcome en el header', async () => {
    // Assert
    await expect(homePage.welcomeMessage).toContainText('Welcome');
  });

  // ─── Elementos del header ────────────────────────────────────────────

  test('debe mostrar el botón de menú hamburguesa', async () => {
    // Assert
    await expect(homePage.menuButton).toBeVisible();
  });

  test('debe mostrar el botón de avatar', async () => {
    // Assert
    await expect(homePage.avatarButton).toBeVisible();
  });

  test('debe permitir hacer click en el botón de menú', async () => {
    // Act & Assert — verificar que el botón es clickeable sin errores
    await expect(homePage.menuButton).toBeEnabled();
    await homePage.menuButton.click();
  });

  test('debe permitir hacer click en el botón de avatar', async () => {
    // Act & Assert — verificar que el botón es clickeable sin errores
    await expect(homePage.avatarButton).toBeEnabled();
    await homePage.avatarButton.click();
  });

  // ─── Protección de ruta (auth guard) ─────────────────────────────────

  test('debe redirigir al login cuando se accede sin autenticación', async ({ page }) => {
    // Arrange — abrir una nueva página sin sesión
    const newPage = new HomePage(page);

    // Act — navegar a una nueva instancia del navegador sin autenticación
    await page.goto('/dashboard/home');

    // Assert — como el estado se pierde al recargar (no hay persistencia),
    // el guard debe redirigir al login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  // ─── URL correcta ───────────────────────────────────────────────────

  test('debe estar en la ruta /dashboard/home después del login', async ({ page }) => {
    // Assert
    await expect(page).toHaveURL(/\/dashboard\/home/);
  });
});
