import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: 'CANDIDATE' | 'RECRUITER';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Erreur parsing user storage', e);
          this.logout();
        }
      }
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }


  login(credentials: { email: string, password: string }): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Email ou mot de passe incorrect');
        }
        return users[0];
      }),
      tap(user => {
        // Mise à jour de l'état et de la persistance
        this.updateState(user);
      })
    );
  }

  register(user: User): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${user.email}`).pipe(
      switchMap(users => {
        if (users.length > 0) {
          return throwError(() => new Error('Cet email est déjà utilisé'));
        }
        return this.http.post<User>(this.apiUrl, user);
      }),
      tap(newUser => {
        // Optionnel : Auto-login après inscription
        // this.updateState(newUser);
      })
    );
  }

  logout(): void {
    // 1. Nettoyer le storage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
    // 2. Nettoyer l'état en mémoire
    this.currentUserSubject.next(null);
    // 3. Redirection
    this.router.navigate(['/auth/login']);
  }

  /**
   * Helper centralisé pour mettre à jour l'état et le storage simultanément.
   */
  private updateState(user: User): void {
    // Sécurité : On ne stocke jamais le mot de passe
    const { password, ...userWithoutPassword } = user;

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    }

    this.currentUserSubject.next(userWithoutPassword as User);
  }
}
