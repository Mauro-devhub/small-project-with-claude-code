import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoginFormComponent, LoginFormData } from './login-form.component';
import { InputFieldComponent } from '../../../shared/components/input-field/input-field.component';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let component: LoginFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  // ─── Estado inicial ─────────────────────────────────────────────────────

  it('debe iniciar en modo login', () => {
    // Assert
    expect(component.isRegisterMode()).toBeFalse();
    expect(component.title()).toBe('Iniciar sesión');
    expect(component.submitLabel()).toBe('Iniciar sesión');
  });

  it('debe iniciar con email y password vacíos', () => {
    // Assert
    expect(component.email()).toBe('');
    expect(component.password()).toBe('');
  });

  it('debe tener el formulario inválido con campos vacíos', () => {
    // Assert
    expect(component.isFormValid()).toBeFalse();
  });

  // ─── Validaciones de email ──────────────────────────────────────────────

  it('debe mostrar error cuando el email está vacío', () => {
    // Arrange
    component.email.set('');

    // Assert
    expect(component.emailErrors()).toEqual(['El correo es requerido']);
  });

  it('debe mostrar error cuando el email es inválido', () => {
    // Arrange
    component.email.set('correo-invalido');

    // Assert
    expect(component.emailErrors()).toEqual(['Ingresa un correo válido']);
  });

  it('debe no tener errores cuando el email es válido', () => {
    // Arrange
    component.email.set('test@example.com');

    // Assert
    expect(component.emailErrors()).toEqual([]);
  });

  it('debe considerar inválido un email con solo espacios', () => {
    // Arrange
    component.email.set('   ');

    // Assert
    expect(component.emailErrors()).toEqual(['El correo es requerido']);
  });

  // ─── Validaciones de password ───────────────────────────────────────────

  it('debe mostrar error cuando la contraseña está vacía', () => {
    // Arrange
    component.password.set('');

    // Assert
    expect(component.passwordErrors()).toEqual(['La contraseña es requerida']);
  });

  it('debe mostrar error cuando la contraseña tiene menos de 6 caracteres', () => {
    // Arrange
    component.password.set('12345');

    // Assert
    expect(component.passwordErrors()).toEqual(['Mínimo 6 caracteres']);
  });

  it('debe no tener errores cuando la contraseña tiene 6 o más caracteres', () => {
    // Arrange
    component.password.set('123456');

    // Assert
    expect(component.passwordErrors()).toEqual([]);
  });

  // ─── Formulario válido ──────────────────────────────────────────────────

  it('debe ser válido cuando email y password son correctos', () => {
    // Arrange
    component.email.set('test@example.com');
    component.password.set('123456');

    // Assert
    expect(component.isFormValid()).toBeTrue();
  });

  it('debe ser inválido cuando solo el email es correcto', () => {
    // Arrange
    component.email.set('test@example.com');
    component.password.set('123');

    // Assert
    expect(component.isFormValid()).toBeFalse();
  });

  // ─── Toggle entre login y registro ──────────────────────────────────────

  it('debe cambiar a modo registro al seleccionar índice 1', () => {
    // Act
    component.onToggleChange(1);

    // Assert
    expect(component.isRegisterMode()).toBeTrue();
    expect(component.title()).toBe('Registrarse');
    expect(component.submitLabel()).toBe('Registrarse');
  });

  it('debe volver a modo login al seleccionar índice 0', () => {
    // Arrange
    component.onToggleChange(1);

    // Act
    component.onToggleChange(0);

    // Assert
    expect(component.isRegisterMode()).toBeFalse();
    expect(component.title()).toBe('Iniciar sesión');
  });

  it('debe limpiar email y password al cambiar de modo', () => {
    // Arrange
    component.email.set('test@example.com');
    component.password.set('123456');

    // Act
    component.onToggleChange(1);

    // Assert
    expect(component.email()).toBe('');
    expect(component.password()).toBe('');
  });

  it('debe resetear el estado touched de los inputs al cambiar de modo', () => {
    // Arrange
    fixture.detectChanges();
    const inputFields = component.inputFields();
    inputFields.forEach(f => spyOn(f, 'resetTouched'));

    // Act
    component.onToggleChange(1);

    // Assert
    inputFields.forEach(f => {
      expect(f.resetTouched).toHaveBeenCalled();
    });
  });

  // ─── Submit ─────────────────────────────────────────────────────────────

  it('debe emitir formSubmit con datos de login cuando el formulario es válido', () => {
    // Arrange
    component.email.set('test@example.com');
    component.password.set('123456');
    let emittedData: LoginFormData | undefined;
    component.formSubmit.subscribe((data: LoginFormData) => emittedData = data);

    // Act
    component.onSubmit();

    // Assert
    expect(emittedData).toEqual({
      email: 'test@example.com',
      password: '123456',
      isRegister: false,
    });
  });

  it('debe emitir formSubmit con isRegister true en modo registro', () => {
    // Arrange
    component.onToggleChange(1);
    component.email.set('test@example.com');
    component.password.set('123456');
    let emittedData: LoginFormData | undefined;
    component.formSubmit.subscribe((data: LoginFormData) => emittedData = data);

    // Act
    component.onSubmit();

    // Assert
    expect(emittedData?.isRegister).toBeTrue();
  });

  it('no debe emitir formSubmit cuando el formulario es inválido', () => {
    // Arrange
    component.email.set('');
    component.password.set('');
    let emitted = false;
    component.formSubmit.subscribe(() => emitted = true);

    // Act
    component.onSubmit();

    // Assert
    expect(emitted).toBeFalse();
  });

  it('debe marcar todos los inputs como touched al intentar submit inválido', () => {
    // Arrange
    fixture.detectChanges();
    const inputFields = component.inputFields();
    inputFields.forEach(f => spyOn(f, 'markAsTouched'));

    // Act
    component.onSubmit();

    // Assert
    inputFields.forEach(f => {
      expect(f.markAsTouched).toHaveBeenCalled();
    });
  });

  // ─── Renderizado del template ───────────────────────────────────────────

  it('debe renderizar el título como "Iniciar sesión" por defecto', () => {
    // Assert
    const title = fixture.debugElement.query(By.css('.form-title'));
    expect(title.nativeElement.textContent).toContain('Iniciar sesión');
  });

  it('debe renderizar el título como "Registrarse" en modo registro', () => {
    // Arrange
    component.onToggleChange(1);

    // Act
    fixture.detectChanges();

    // Assert
    const title = fixture.debugElement.query(By.css('.form-title'));
    expect(title.nativeElement.textContent).toContain('Registrarse');
  });

  it('debe renderizar dos campos de entrada (email y password)', () => {
    // Assert
    const inputs = fixture.debugElement.queryAll(By.directive(InputFieldComponent));
    expect(inputs.length).toBe(2);
  });
});
