import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Vérification de l'état en mémoire (BehaviorSubject)
  if (authService.isAuthenticated()) {
    return true; // L'utilisateur est authentifié, on autorise l'accès
  }

  // 2. Redirection si non authentifié
  // On passe l'URL de retour pour une meilleure UX après connexion
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
