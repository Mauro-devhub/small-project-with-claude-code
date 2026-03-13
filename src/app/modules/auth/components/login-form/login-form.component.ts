// Componente del formulario de login/registro del módulo auth
import { Component, signal, computed, viewChildren, output } from '@angular/core';
import { InputFieldComponent } from '../../../shared/components/input-field/input-field.component';
import { ToggleButtonGroupComponent } from '../../../shared/components/toggle-button-group/toggle-button-group.component';
import { SubmitButtonComponent } from '../../../shared/components/submit-button/submit-button.component';

// Interfaz para los datos del formulario
export interface LoginFormData {
  email: string;
  password: string;
  isRegister: boolean;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [InputFieldComponent, ToggleButtonGroupComponent, SubmitButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  // Emite los datos del formulario al hacer submit
  formSubmit = output<LoginFormData>();

  // Referencia a los inputs para controlar touched/reset
  inputFields = viewChildren(InputFieldComponent);

  // Signals del formulario
  email = signal('');
  password = signal('');

  // Controla si estamos en modo registro o login
  isRegisterMode = signal(false);

  // Opciones del toggle y label del submit
  toggleOptions = ['Iniciar sesión', 'Registrarse'];
  activeToggleIndex = computed(() => this.isRegisterMode() ? 1 : 0);
  submitLabel = computed(() => this.isRegisterMode() ? 'Registrarse' : 'Iniciar sesión');
  title = computed(() => this.isRegisterMode() ? 'Registrarse' : 'Iniciar sesión');

  // Validaciones computadas
  emailErrors = computed(() => {
    const value = this.email().trim();
    if (value === '') return ['El correo es requerido'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return ['Ingresa un correo válido'];
    return [];
  });

  passwordErrors = computed(() => {
    const value = this.password();
    if (value.trim() === '') return ['La contraseña es requerida'];
    if (value.length < 6) return ['Mínimo 6 caracteres'];
    return [];
  });

  isFormValid = computed(() =>
    this.emailErrors().length === 0 && this.passwordErrors().length === 0
  );

  // Cambia el modo según el índice del toggle
  onToggleChange(index: number): void {
    this.isRegisterMode.set(index === 1);
    this.email.set('');
    this.password.set('');
    this.inputFields().forEach(f => f.resetTouched());
  }

  // Envía el formulario
  onSubmit(): void {
    this.inputFields().forEach(f => f.markAsTouched());

    if (!this.isFormValid()) {
      return;
    }

    this.formSubmit.emit({
      email: this.email(),
      password: this.password(),
      isRegister: this.isRegisterMode()
    });
  }
}
