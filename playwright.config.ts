import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
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