// Componente reutilizable de botón de submit
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.scss'
})
export class SubmitButtonComponent {
  // Texto del botón
  label = input.required<string>();

  // Permite deshabilitar el botón
  disabled = input<boolean>(false);
}
