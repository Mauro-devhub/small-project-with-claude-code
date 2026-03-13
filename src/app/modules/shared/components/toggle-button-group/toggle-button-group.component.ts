// Componente reutilizable de grupo de botones tipo toggle con transición animada
import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-toggle-button-group',
  standalone: true,
  templateUrl: './toggle-button-group.component.html',
  styleUrl: './toggle-button-group.component.scss'
})
export class ToggleButtonGroupComponent {
  // Lista de opciones a mostrar como botones
  options = input.required<string[]>();

  // Índice de la opción activa
  activeIndex = input<number>(0);

  // Emite el índice seleccionado al hacer click
  activeIndexChange = output<number>();

  // Determina si un botón está activo
  isActive(index: number): boolean {
    return index === this.activeIndex();
  }

  selectOption(index: number): void {
    if (index !== this.activeIndex()) {
      this.activeIndexChange.emit(index);
    }
  }
}
