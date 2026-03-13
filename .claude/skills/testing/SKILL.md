---
name: angular-testing
description: "Define y genera tests unitarios y de integración para proyectos Angular 19+ con standalone components usando Karma + Jasmine. Usa esta skill cuando el usuario pida escribir tests, specs, pruebas unitarias, pruebas de integración, coverage, mocks, spies, o cualquier verificación de comportamiento de componentes, servicios, stores, pipes, guards o directivas. También aplica cuando se mencionen palabras como test, spec, it(), describe(), expect(), TestBed, fakeAsync, spy, mock, stub, coverage. Actívala incluso si la solicitud es vaga como 'escribe las pruebas para el servicio de usuarios' o 'agrega tests al store de productos'."
---

# Angular Testing Skill

Skill encargada de definir e implementar pruebas unitarias y de integración en proyectos
Angular 19.2.0+ con standalone components, usando **Karma 6.4** + **Jasmine 5.6**.

---

## Stack de testing

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| Karma | ~6.4.0 | Test runner (ejecuta en Chrome) |
| Jasmine | ~5.6.0 | Framework de assertions y mocks |
| karma-coverage | ~2.2.0 | Reporte de cobertura de código |
| @types/jasmine | ~5.1.0 | Tipos TypeScript para Jasmine |

---

## Ubicación de los archivos de test

Cada spec file vive **junto al archivo que testea**, en la misma carpeta:
```
src/app/modules/[name-module]/
├── [name-module].component.ts
├── [name-module].component.spec.ts       ← test del componente raíz
├── services/
│   ├── [name-module].service.ts
│   └── [name-module].service.spec.ts     ← test del servicio
├── store/
│   ├── [name-module].store.ts
│   └── [name-module].store.spec.ts       ← test del store
└── components/
    └── [name-component]/
        ├── [name-component].component.ts
        └── [name-component].component.spec.ts
```

> Nunca crear carpetas `__tests__/` ni `tests/` separadas.
> El spec file siempre tiene el mismo nombre base que el archivo que prueba.

---

## Reglas generales obligatorias

| Regla | Detalle |
|-------|---------|
| **Un describe por archivo** | El `describe` raíz lleva el nombre exacto de la clase o función bajo prueba |
| **Un concepto por `it()`** | Cada test prueba una sola cosa; si necesitas probar dos cosas, son dos `it()` |
| **Arrange / Act / Assert** | Todo test sigue esta estructura interna, separada por línea en blanco |
| **Sin lógica en tests** | No usar `if`, `for`, ni operadores ternarios dentro de un `it()` |
| **Mocks siempre** | Nunca llamar servicios HTTP reales; siempre usar `spyOn` o providers falsos |
| **Sin `fit()` ni `fdescribe()`** | Prohibido hacer focus en CI; solo permitido localmente durante desarrollo |
| **`afterEach` limpio** | Resetear cualquier spy o estado global en `afterEach` si aplica |
| **Nombres en español** | Las descripciones de `describe` e `it()` se escriben en español |

---

## Estructura interna de un `it()` — Arrange / Act / Assert
```typescript
it('debe retornar el usuario cuando el id es válido', () => {
  // Arrange — preparar datos y condiciones
  const userId = '123';
  const expectedUser: UserModel = { id: '123', name: 'John Doe' };
  spyOn(service, 'getById').and.returnValue(of(expectedUser));

  // Act — ejecutar la acción bajo prueba
  const result = service.getById(userId);

  // Assert — verificar el resultado esperado
  result.subscribe((user) => {
    expect(user).toEqual(expectedUser);
  });
});
```

---

## Testing de Servicios
```typescript
import { TestBed }            from '@angular/core/testing';
import { HttpClientTestingModule,
         HttpTestingController } from '@angular/common/http/testing';
import { UserService }           from './user.service';
import { UserModel }             from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:   [HttpClientTestingModule],
      providers: [UserService],
    });

    // Obtener instancias del servicio y el mock HTTP
    service  = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificar que no queden requests HTTP sin resolver
    httpMock.verify();
  });

  it('debe obtener la lista de usuarios correctamente', () => {
    // Arrange
    const mockUsers: UserModel[] = [
      { id: '1', name: 'Ana García' },
      { id: '2', name: 'Carlos López' },
    ];

    // Act
    service.getAll().subscribe((users) => {
      // Assert
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    // Resolver el request HTTP pendiente con datos mock
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('debe lanzar error cuando el servidor responde con 500', () => {
    // Arrange
    let errorReceived = false;

    // Act
    service.getAll().subscribe({
      next:  () => fail('Se esperaba un error pero se recibió respuesta exitosa'),
      error: () => { errorReceived = true; },
    });

    // Simular respuesta de error del servidor
    const req = httpMock.expectOne('/api/users');
    req.flush('Error del servidor', { status: 500, statusText: 'Server Error' });

    // Assert
    expect(errorReceived).toBeTrue();
  });
});
```

---

## Testing de Componentes
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }                         from '@angular/platform-browser';
import { signal }                     from '@angular/core';
import { UserListComponent }          from './user-list.component';
import { UserStore }                  from '../store/user.store';

describe('UserListComponent', () => {
  let fixture:   ComponentFixture<UserListComponent>;
  let component: UserListComponent;

  // Mock del store con signals para aislar el componente
  const mockStore = {
    items:      signal([{ id: '1', name: 'Ana García' }]),
    isLoading:  signal(false),
    isEmpty:    signal(false),
    error:      signal(null),
    loadAll:    jasmine.createSpy('loadAll'),
    selectItem: jasmine.createSpy('selectItem'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:   [UserListComponent],
      providers: [
        // Reemplazar el store real con el mock
        { provide: UserStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('debe llamar a loadAll al inicializar', () => {
    // Assert — verificar que la carga se disparó en ngOnInit
    expect(mockStore.loadAll).toHaveBeenCalledOnce();
  });

  it('debe renderizar un item por cada elemento en el store', () => {
    // Arrange
    mockStore.items.set([
      { id: '1', name: 'Ana García' },
      { id: '2', name: 'Carlos López' },
    ]);

    // Act
    fixture.detectChanges();

    // Assert — contar elementos renderizados en el DOM
    const items = fixture.debugElement.queryAll(By.css('[data-testid="user-item"]'));
    expect(items.length).toBe(2);
  });

  it('debe mostrar el indicador de carga cuando isLoading es true', () => {
    // Arrange
    mockStore.isLoading.set(true);

    // Act
    fixture.detectChanges();

    // Assert
    const loader = fixture.debugElement.query(By.css('[data-testid="loading"]'));
    expect(loader).not.toBeNull();
  });

  it('debe mostrar mensaje de error cuando el store tiene un error', () => {
    // Arrange
    mockStore.error.set('Error al cargar usuarios');

    // Act
    fixture.detectChanges();

    // Assert
    const errorEl = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
    expect(errorEl.nativeElement.textContent).toContain('Error al cargar usuarios');
  });
});
```

---

## Testing del NgRx SignalStore
```typescript
import { TestBed }       from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserStore }      from './user.store';
import { UserService }    from '../services/user.service';
import { UserModel }      from '../models/user.model';

describe('UserStore', () => {
  let store:   InstanceType<typeof UserStore>;
  let service: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    // Crear spy del servicio con todos sus métodos mockeados
    const serviceSpy = jasmine.createSpyObj<UserService>(
      'UserService',
      ['getAll', 'getById', 'create', 'update', 'delete']
    );

    TestBed.configureTestingModule({
      providers: [
        UserStore,
        { provide: UserService, useValue: serviceSpy },
      ],
    });

    store   = TestBed.inject(UserStore);
    service = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('debe iniciar con el estado vacío', () => {
    // Assert — verificar estado inicial
    expect(store.items()).toEqual([]);
    expect(store.isLoading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('debe cargar items y actualizar el estado correctamente', (done) => {
    // Arrange
    const mockUsers: UserModel[] = [{ id: '1', name: 'Ana García' }];
    service.getAll.and.returnValue(of(mockUsers));

    // Act
    store.loadAll();

    // Assert — verificar estado luego de la carga
    setTimeout(() => {
      expect(store.items()).toEqual(mockUsers);
      expect(store.isLoading()).toBeFalse();
      expect(store.error()).toBeNull();
      done();
    }, 0);
  });

  it('debe registrar el error en el estado cuando getAll falla', (done) => {
    // Arrange
    const mockError = new Error('Error de red');
    service.getAll.and.returnValue(throwError(() => mockError));

    // Act
    store.loadAll();

    // Assert
    setTimeout(() => {
      expect(store.error()).toBe('Error de red');
      expect(store.isLoading()).toBeFalse();
      done();
    }, 0);
  });

  it('debe agregar el nuevo item a la lista al crear correctamente', (done) => {
    // Arrange
    const newUser: UserModel     = { id: '2', name: 'Carlos López' };
    const payload                = { name: 'Carlos López' };
    service.create.and.returnValue(of(newUser));

    // Act
    store.create(payload);

    // Assert
    setTimeout(() => {
      expect(store.items()).toContain(newUser);
      expect(store.isSaving()).toBeFalse();
      done();
    }, 0);
  });

  it('debe eliminar el item correcto de la lista al hacer remove', (done) => {
    // Arrange — pre-cargar items en el estado
    const users: UserModel[] = [
      { id: '1', name: 'Ana García' },
      { id: '2', name: 'Carlos López' },
    ];
    service.getAll.and.returnValue(of(users));
    store.loadAll();

    service.delete.and.returnValue(of(void 0));

    // Act
    setTimeout(() => {
      store.remove('1');

      // Assert
      setTimeout(() => {
        expect(store.items().find((u) => u.id === '1')).toBeUndefined();
        expect(store.items().length).toBe(1);
        done();
      }, 0);
    }, 0);
  });
});
```

---

## Convención de `data-testid`

Para evitar acoplar los tests a clases CSS o estructura HTML, **todos los elementos
interactivos o verificables deben tener un atributo `data-testid`**:
```html
<!-- Identificadores semánticos para los tests -->
<div data-testid="user-list">
  @for (user of store.items(); track user.id) {
    <div data-testid="user-item">{{ user.name }}</div>
  }
</div>

<app-spinner *ngIf="store.isLoading()" data-testid="loading" />
<p data-testid="error-message">{{ store.error() }}</p>
<p data-testid="empty-state">No hay usuarios registrados.</p>
```
```typescript
// Consulta por data-testid en el test — nunca por clase CSS
const item = fixture.debugElement.query(By.css('[data-testid="user-item"]'));
```

---

## Cobertura de código — Umbrales mínimos

Configurar en `karma.conf.js`:
```javascript
coverageReporter: {
  thresholds: {
    emitters: {
      global: {
        statements: 80,  // mínimo 80% de statements cubiertos
        branches:   75,  // mínimo 75% de branches cubiertos
        functions:  80,  // mínimo 80% de funciones cubiertas
        lines:      80,  // mínimo 80% de líneas cubiertas
      },
    },
  },
},
```

Ejecutar cobertura:
```bash
ng test --code-coverage
```

El reporte HTML se genera en `coverage/[project-name]/index.html`.

---

## Checklist antes de entregar un test

- [ ] ¿El `describe` raíz tiene el nombre exacto de la clase bajo prueba?
- [ ] ¿Cada `it()` prueba una sola responsabilidad?
- [ ] ¿Se respeta la estructura Arrange / Act / Assert con líneas en blanco?
- [ ] ¿Todos los servicios HTTP usan `HttpClientTestingModule`?
- [ ] ¿Los stores se mockean con `jasmine.createSpyObj` o signals mockeados?
- [ ] ¿Se usa `data-testid` para queries al DOM?
- [ ] ¿Se llama `httpMock.verify()` en el `afterEach` de servicios HTTP?
- [ ] ¿No hay `fit()`, `fdescribe()`, ni `xit()` olvidados?
- [ ] ¿Las descripciones de `describe` e `it()` están en español?