import { test, expect } from '@playwright/test';
import { LoginPage } from './login.page';

test.describe('LoginComponent', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForReady();
  });

  // ─── Renderizado inicial ─────────────────────────────────────────────

  test('debe renderizar el formulario de login correctamente', async () => {
    // Assert
    await expect(loginPage.formTitle).toHaveText('Iniciar sesión');
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toHaveText('Iniciar sesión');
  });

  test('debe mostrar las opciones de toggle login y registro', async () => {
    // Assert
    await expect(loginPage.toggleLogin).toHaveText('Iniciar sesión');
    await expect(loginPage.toggleRegister).toHaveText('Registrarse');
  });

  // ─── Validaciones del formulario ─────────────────────────────────────

  test('debe mostrar errores al enviar el formulario vacío', async () => {
    // Act
    await loginPage.submitButton.click();

    // Assert
    const errors = loginPage.getErrorMessages();
    await expect(errors.first()).toBeVisible();
  });

  test('debe mostrar error de email inválido', async () => {
    // Arrange
    await loginPage.emailInput.fill('correo-invalido');
    await loginPage.emailInput.blur();

    // Assert
    const errors = loginPage.getErrorMessages();
    await expect(errors.first()).toContainText('Ingresa un correo válido');
  });

  test('debe mostrar error de contraseña corta', async () => {
    // Arrange
    await loginPage.passwordInput.fill('123');
    await loginPage.passwordInput.blur();

    // Assert
    const errors = loginPage.getErrorMessages();
    await expect(errors.last()).toContainText('Mínimo 6 caracteres');
  });

  test('no debe mostrar errores con datos válidos', async () => {
    // Arrange
    await loginPage.emailInput.fill('test@example.com');
    await loginPage.emailInput.blur();
    await loginPage.passwordInput.fill('123456');
    await loginPage.passwordInput.blur();

    // Assert
    const errors = loginPage.getErrorMessages();
    await expect(errors).toHaveCount(0);
  });

  // ─── Login exitoso ───────────────────────────────────────────────────

  test('debe navegar al dashboard al hacer login con datos válidos', async ({ page }) => {
    // Act
    await loginPage.fillAndSubmit('test@example.com', '123456');

    // Assert
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // ─── Toggle entre modos ──────────────────────────────────────────────

  test('debe cambiar a modo registro al hacer click en Registrarse', async () => {
    // Act
    await loginPage.toggleRegister.click();

    // Assert
    await expect(loginPage.formTitle).toHaveText('Registrarse');
    await expect(loginPage.submitButton).toHaveText('Registrarse');
  });

  test('debe volver a modo login al hacer click en Iniciar sesión', async () => {
    // Arrange
    await loginPage.toggleRegister.click();

    // Act
    await loginPage.toggleLogin.click();

    // Assert
    await expect(loginPage.formTitle).toHaveText('Iniciar sesión');
    await expect(loginPage.submitButton).toHaveText('Iniciar sesión');
  });

  test('debe limpiar los campos al cambiar de modo', async () => {
    // Arrange
    await loginPage.emailInput.fill('test@example.com');
    await loginPage.passwordInput.fill('123456');

    // Act
    await loginPage.toggleRegister.click();

    // Assert
    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });

  // ─── Registro exitoso ────────────────────────────────────────────────

  test('debe navegar al dashboard al registrarse con datos válidos', async ({ page }) => {
    // Arrange
    await loginPage.toggleRegister.click();

    // Act
    await loginPage.fillAndSubmit('nuevo@example.com', '123456');

    // Assert
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // ─── Modal de redirección ────────────────────────────────────────────

  test('debe mostrar modal de acceso restringido cuando viene redirigido', async ({ page }) => {
    // Arrange — navegar con parámetro redirected=true
    const redirectPage = new LoginPage(page);
    await redirectPage.gotoRedirected();
    await redirectPage.waitForReady();

    // Assert
    await expect(redirectPage.modalOverlay).toBeVisible();
    await expect(redirectPage.modalTitle).toHaveText('Acceso restringido');
    await expect(redirectPage.modalBody).toContainText('debes iniciar sesión');
  });

  test('debe cerrar el modal al hacer click en Aceptar', async ({ page }) => {
    // Arrange
    const redirectPage = new LoginPage(page);
    await redirectPage.gotoRedirected();
    await redirectPage.waitForReady();
    await expect(redirectPage.modalOverlay).toBeVisible();

    // Act
    await redirectPage.modalBtnClose.click();

    // Assert
    await expect(redirectPage.modalOverlay).not.toBeVisible();
  });

  test('no debe mostrar modal cuando la navegación es directa', async () => {
    // Assert
    await expect(loginPage.modalOverlay).not.toBeVisible();
  });
});
