// Componente reutilizable de campo de entrada con label, placeholder y errores
import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss'
})
export class InputFieldComponent {
  // Inputs del componente
  label = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  value = input<string>('');
  errors = input<string[]>([]);

  // Output para notificar cambios de valor
  valueChange = output<string>();

  // Estado interno de touched
  touched = signal(false);

  // Indica si hay errores visibles (solo después de touched)
  showErrors = computed(() => this.touched() && this.errors().length > 0);

  // Indica si el input está en estado inválido
  isInvalid = computed(() => this.touched() && this.errors().length > 0);

  onInput(newValue: string): void {
    this.valueChange.emit(newValue);
  }

  onBlur(): void {
    this.touched.set(true);
  }

  // Permite forzar el estado touched desde fuera
  markAsTouched(): void {
    this.touched.set(true);
  }

  // Permite resetear el estado touched desde fuera
  resetTouched(): void {
    this.touched.set(false);
  }
}
