// Componente reutilizable de modal
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  // Título del modal
  title = input<string>('');

  // Texto del botón de cierre
  closeLabel = input<string>('Aceptar');

  // Controla la visibilidad desde fuera
  visible = input.required<boolean>();

  // Emite cuando se cierra el modal
  closed = output<void>();

  onClose(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    // Cierra solo si se hace click en el overlay, no en el contenido
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
