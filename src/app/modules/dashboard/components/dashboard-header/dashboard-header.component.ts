// Componente del header del dashboard con menú hamburguesa, bienvenida y avatar
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent {
  // Email del usuario para mostrar en el mensaje de bienvenida
  userEmail = input.required<string>();

  // Eventos del header
  menuClick = output<void>();
  avatarClick = output<void>();

  onMenuClick(): void {
    this.menuClick.emit();
  }

  onAvatarClick(): void {
    this.avatarClick.emit();
  }
}
