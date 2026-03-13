// Página de Login/Register — conecta el formulario con el store y navega al dashboard
import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginFormComponent, LoginFormData } from '../../components/login-form/login-form.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent, ModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Controla la visibilidad del modal de redirección
  showRedirectModal = signal(false);

  ngOnInit(): void {
    // Muestra el modal si el usuario fue redirigido por el guard
    const redirected = this.route.snapshot.queryParamMap.get('redirected');
    if (redirected === 'true') {
      this.showRedirectModal.set(true);
    }
  }

  onCloseModal(): void {
    this.showRedirectModal.set(false);
  }

  onFormSubmit(data: LoginFormData): void {
    if (data.isRegister) {
      this.authStore.register(data.email);
    } else {
      this.authStore.login(data.email);
    }

    this.router.navigate(['/dashboard']);
  }
}
