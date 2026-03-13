---
name: playwright
description: "Define y genera tests end-to-end (E2E) con Playwright para proyectos Angular 19+. Usa esta skill cuando el usuario pida escribir tests E2E, pruebas de integración visual, flujos de usuario, navegación, formularios, autenticación, interacciones del DOM, screenshots, o cualquier verificación de comportamiento desde el navegador. También aplica cuando se mencionen palabras como playwright, e2e, end-to-end, flujo completo, prueba de navegador, test de pantalla, page object, locator, expect visual, fill, click, navigate, screenshot. Actívala incluso si la solicitud es vaga como 'escribe las pruebas E2E del login' o 'agrega playwright al módulo de usuarios'."
---

# Angular Playwright Testing Skill

Skill encargada de definir e implementar pruebas E2E con **Playwright 1.58+** en
proyectos Angular 19.2.0+ con standalone components.

---

## Dependencia requerida
```bash
npm install -D @playwright/test
npx playwright install
```

---

## Nomenclatura y ubicación de archivos

Cada spec file vive **junto al archivo que testea**, con el sufijo `.playwright.spec.ts`:
```
src/app/modules/[name-module]/
├── [name-module].component.ts
├── [name-module].playwright.spec.ts        ← E2E del componente raíz del módulo

├── components/
│   └── [name-component]/
│       ├── [name-component].component.ts
│       └── [name-component].playwright.spec.ts

└── pages/
    └── [name-page]/
        ├── [name-page].component.ts
        └── [name-page].playwright.spec.ts
```

> Nunca crear carpetas `e2e/` ni `tests/` separadas.
> El spec siempre tiene el mismo nombre base que el componente al que le hace testing.

---

## Configuración base — `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directorio raíz donde Playwright busca los specs
  testDir:  './src',

  // Patrón exclusivo para archivos Playwright (nunca toca los .spec.ts de Karma)
  testMatch: '**/*.playwright.spec.ts',

  // Tiempo máximo por test antes de considerarlo fallido
  timeout: 30_000,

  // Reintentos automáticos solo en CI
  retries: process.env['CI'] ? 2 : 0,

  // Número de workers paralelos
  workers: process.env['CI'] ? 1 : undefined,

  // Reporte HTML generado en playwright-report/
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    // URL base de la app Angular en desarrollo
    baseURL: 'http://localhost:4200',

    // Capturar trace solo cuando el test falla por primera vez
    trace: 'on-first-retry',

    // Screenshot solo al fallar
    screenshot: 'only-on-failure',

    // Video solo al primer reintento
    video: 'on-first-retry',
  },

  projects: [
    {
      name:  'chromium',
      use:   { ...devices['Desktop Chrome'] },
    },
    {
      name:  'firefox',
      use:   { ...devices['Desktop Firefox'] },
    },
  ],

  // Levantar la app Angular antes de correr los tests
  webServer: {
    command:            'ng serve',
    url:                'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout:            120_000,
  },
});
```

---

## Patrón obligatorio — Page Object Model (POM)

Cada pantalla o componente complejo debe tener su propio **Page Object**.
El POM encapsula los selectores y acciones, manteniendo los tests limpios.

### Ubicación del Page Object
```
src/app/modules/[name-module]/
├── [name-module].page.ts                   ← Page Object del módulo
└── [name-module].playwright.spec.ts        ← Tests que consumen el POM
```

### Plantilla base de un Page Object
```typescript
import { Page, Locator, expect } from '@playwright/test';

// Page Object que encapsula los selectores y acciones de la pantalla
export class [Name]Page {
  // ─── Locators ──────────────────────────────────────────────────────────
  readonly heading:       Locator;
  readonly errorMessage:  Locator;
  readonly loadingSpinner: Locator;

  constructor(private readonly page: Page) {
    // Siempre usar data-testid para los locators; nunca clases CSS ni XPath
    this.heading        = page.getByTestId('page-heading');
    this.errorMessage   = page.getByTestId('error-message');
    this.loadingSpinner = page.getByTestId('loading');
  }

  // ─── Navegación ────────────────────────────────────────────────────────

  // Navega a la ruta base de esta pantalla
  async goto(): Promise<void> {
    await this.page.goto('/[route]');
  }

  // Espera a que la pantalla esté completamente cargada
  async waitForReady(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}
```

---

## Estructura interna de un test — Arrange / Act / Assert
```typescript
import { test, expect } from '@playwright/test';
import { [Name]Page }   from './[name-module].page';

test('debe mostrar el título de la pantalla al navegar a la ruta', async ({ page }) => {
  // Arrange — instanciar el POM y navegar
  const screen = new [Name]Page(page);
  await screen.goto();

  // Act — esperar que la pantalla esté lista
  await screen.waitForReady();

  // Assert — verificar el contenido visible
  await expect(screen.heading).toHaveText('Título esperado');
});
```

---

## Plantilla completa de un spec file
```typescript
import { test, expect, Page } from '@playwright/test';
import { [Name]Page }          from './[name-module].page';

// Agrupación principal: nombre exacto del módulo o componente bajo prueba
test.describe('[Name]Component', () => {

  let screen: [Name]Page;

  // Configuración que se ejecuta antes de cada test
  test.beforeEach(async ({ page }) => {
    screen = new [Name]Page(page);
    await screen.goto();
    await screen.waitForReady();
  });

  // ─── Renderizado inicial ─────────────────────────────────────────────

  test('debe renderizar la pantalla correctamente', async () => {
    // Assert — verificar elementos clave del layout inicial
    await expect(screen.heading).toBeVisible();
  });

  // ─── Interacciones ───────────────────────────────────────────────────

  test('debe mostrar error cuando el formulario se envía vacío', async ({ page }) => {
    // Arrange
    const submitBtn = page.getByTestId('submit-button');

    // Act
    await submitBtn.click();

    // Assert
    await expect(screen.errorMessage).toBeVisible();
  });

  // ─── Estados de carga ────────────────────────────────────────────────

  test('debe ocultar el spinner cuando los datos terminan de cargar', async () => {
    // Assert — el spinner no debe estar visible tras la carga inicial
    await expect(screen.loadingSpinner).not.toBeVisible();
  });

  // ─── Navegación ──────────────────────────────────────────────────────

  test('debe navegar a la pantalla de detalle al hacer click en un item', async ({ page }) => {
    // Arrange
    const firstItem = page.getByTestId('list-item').first();

    // Act
    await firstItem.click();

    // Assert
    await expect(page).toHaveURL(/\/detail\/\d+/);
  });
});
```

---

## Testing de formularios
```typescript
import { test, expect, Page } from '@playwright/test';

// Page Object para pantallas con formulario
export class LoginPage {
  constructor(private readonly page: Page) {}

  // ─── Locators del formulario ──────────────────────────────────────────
  get emailInput()    { return this.page.getByTestId('input-email'); }
  get passwordInput() { return this.page.getByTestId('input-password'); }
  get submitButton()  { return this.page.getByTestId('btn-submit'); }
  get errorMessage()  { return this.page.getByTestId('error-message'); }
  get successMessage(){ return this.page.getByTestId('success-message'); }

  async goto() {
    await this.page.goto('/auth/login');
  }

  // Acción que agrupa el llenado y envío del formulario
  async fillAndSubmit(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// ─── Tests del formulario de login ───────────────────────────────────────────
test.describe('LoginComponent', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('debe mostrar error con credenciales inválidas', async () => {
    // Act
    await loginPage.fillAndSubmit('invalido@test.com', 'wrongpass');

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Credenciales inválidas');
  });

  test('debe redirigir al dashboard con credenciales válidas', async ({ page }) => {
    // Act
    await loginPage.fillAndSubmit('usuario@test.com', 'correctpass');

    // Assert
    await expect(page).toHaveURL('/dashboard');
  });

  test('debe deshabilitar el botón mientras el formulario está siendo enviado', async () => {
    // Act
    await loginPage.fillAndSubmit('usuario@test.com', 'correctpass');

    // Assert — el botón no debe ser clickeable durante la petición
    await expect(loginPage.submitButton).toBeDisabled();
  });

  test('debe limpiar el error al comenzar a escribir de nuevo', async () => {
    // Arrange — provocar un error primero
    await loginPage.fillAndSubmit('malo@test.com', 'mal');
    await expect(loginPage.errorMessage).toBeVisible();

    // Act
    await loginPage.emailInput.fill('nuevo@test.com');

    // Assert
    await expect(loginPage.errorMessage).not.toBeVisible();
  });
});
```

---

## Testing con interceptación de red (API mocking)
```typescript
import { test, expect } from '@playwright/test';
import { UserListPage }  from './user-list.page';

test.describe('UserListComponent', () => {

  test('debe renderizar la lista cuando la API responde correctamente', async ({ page }) => {
    // Arrange — interceptar la llamada a la API antes de navegar
    await page.route('**/api/users', async (route) => {
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Ana García' },
          { id: '2', name: 'Carlos López' },
        ]),
      });
    });

    const screen = new UserListPage(page);
    await screen.goto();

    // Assert
    const items = page.getByTestId('user-item');
    await expect(items).toHaveCount(2);
  });

  test('debe mostrar el mensaje de error cuando la API falla', async ({ page }) => {
    // Arrange — simular error del servidor
    await page.route('**/api/users', async (route) => {
      await route.fulfill({ status: 500 });
    });

    const screen = new UserListPage(page);
    await screen.goto();

    // Assert
    await expect(page.getByTestId('error-message')).toBeVisible();
  });

  test('debe mostrar estado vacío cuando la API retorna lista vacía', async ({ page }) => {
    // Arrange
    await page.route('**/api/users', async (route) => {
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify([]),
      });
    });

    const screen = new UserListPage(page);
    await screen.goto();

    // Assert
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });
});
```

---

## Convención de `data-testid`

Igual que en los tests unitarios, **todos los elementos interactivos o verificables
deben tener `data-testid`**. Playwright nunca debe usar clases CSS ni XPath.
```html
<!-- Identificadores semánticos para Playwright -->
<h1  data-testid="page-heading">Usuarios</h1>
<app-spinner data-testid="loading" />
<p   data-testid="error-message">{{ error }}</p>
<p   data-testid="empty-state">No hay usuarios.</p>

@for (user of store.items(); track user.id) {
  <div data-testid="user-item">
    <span data-testid="user-name">{{ user.name }}</span>
    <button data-testid="btn-delete">Eliminar</button>
  </div>
}

<button data-testid="btn-submit">Guardar</button>
```
```typescript
// ✅ Correcto — siempre getByTestId
page.getByTestId('user-item')

// ❌ Incorrecto — nunca clases CSS ni XPath
page.locator('.user-item')
page.locator('//div[@class="user-item"]')
```

---

## Reglas generales obligatorias

| Regla | Detalle |
|-------|---------|
| **POM siempre** | Todo spec file consume un Page Object; nunca locators sueltos en el test |
| **Un `test.describe` por archivo** | El describe raíz lleva el nombre exacto del componente bajo prueba |
| **Un concepto por `test()`** | Cada test verifica una sola cosa |
| **Arrange / Act / Assert** | Estructura interna separada por línea en blanco |
| **`data-testid` siempre** | Nunca usar clases CSS, IDs arbitrarios ni XPath |
| **API mocking con `page.route`** | Nunca depender de un backend real en los tests |
| **`beforeEach` para setup común** | Navegación y espera de carga van en `beforeEach` |
| **Sin `test.only` en commits** | Solo permitido localmente durante desarrollo |
| **Nombres en español** | Las descripciones de `test.describe` y `test()` se escriben en español |
| **Archivo `.page.ts` separado** | El POM vive en su propio archivo junto al spec |

---

## Scripts en `package.json`
```json
{
  "scripts": {
    "test:e2e":          "playwright test",
    "test:e2e:headed":   "playwright test --headed",
    "test:e2e:debug":    "playwright test --debug",
    "test:e2e:report":   "playwright show-report playwright-report",
    "test:e2e:ui":       "playwright test --ui"
  }
}
```

---

## Checklist antes de entregar un test Playwright

- [ ] ¿El archivo se llama `[name].playwright.spec.ts` y está junto al componente?
- [ ] ¿Existe un Page Object en `[name].page.ts` junto al spec?
- [ ] ¿El `test.describe` raíz tiene el nombre exacto del componente bajo prueba?
- [ ] ¿Cada `test()` prueba una sola responsabilidad?
- [ ] ¿Se respeta Arrange / Act / Assert con líneas en blanco?
- [ ] ¿Todos los locators usan `getByTestId`?
- [ ] ¿Las llamadas HTTP están interceptadas con `page.route`?
- [ ] ¿No hay `test.only` ni `test.skip` olvidados?
- [ ] ¿Las descripciones de `test.describe` y `test()` están en español?
- [ ] ¿El `beforeEach` maneja la navegación y espera inicial?