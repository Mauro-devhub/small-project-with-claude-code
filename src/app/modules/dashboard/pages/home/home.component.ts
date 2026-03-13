// Página principal del dashboard — lee el email del usuario desde el AuthStore
import { Component, inject } from '@angular/core';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { AuthStore } from '../../../auth/store/auth.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DashboardHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly authStore = inject(AuthStore);

  onMenuClick(): void {
    console.log('Menu clicked');
  }

  onAvatarClick(): void {
    console.log('Avatar clicked');
  }
}
