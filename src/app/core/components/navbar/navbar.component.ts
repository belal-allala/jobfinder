import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styles: [`
    .nav-link { cursor: pointer; }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);

  // 1. Exposition du flux (Stream)
  // Le composant ne stocke pas l'utilisateur, il stocke le FLUX de l'utilisateur.
  currentUser$: Observable<User | null> = this.authService.currentUser$;

  // 2. Actions
  logout(): void {
    this.authService.logout();
    // Pas besoin de mettre à jour l'UI manuellement ici.
    // Le service va émettre null dans le stream, et le pipe async va mettre à jour la vue.
  }
}
