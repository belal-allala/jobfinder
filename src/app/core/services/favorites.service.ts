import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, throwError, tap } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { Job } from '../models/job.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/favoritesOffers';

  /**
   * Récupère tous les favoris de l'utilisateur connecté.
   */
  getFavorites(): Observable<Favorite[]> {
    const user = this.authService.currentUserValue();
    if (!user || !user.id) {
      console.error('User not connected or no ID');
      return throwError(() => new Error('Utilisateur non connecté'));
    }
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${user.id}`);
  }

  /**
   * Ajoute une offre aux favoris.
   */
  addFavorite(job: Job): Observable<Favorite> {
    const user = this.authService.currentUserValue();

    if (!user || !user.id) {
      console.error('AddFavorite: User not connected');
      return throwError(() => new Error('Utilisateur non connecté'));
    }

    const userId = user.id.toString();
    console.log(`Adding favorite for user ${userId}, job ${job.id}`);

    // Vérification d'unicité
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&jobId=${job.id}`).pipe(
      switchMap(existing => {
        if (existing.length > 0) {
          console.warn('Job already in favorites');
          return throwError(() => new Error('Cette offre est déjà dans vos favoris'));
        }

        const newFavorite: Omit<Favorite, 'id'> = {
          userId: userId,
          jobId: job.id,
          job: job,
          createdAt: new Date().toISOString()
        };

        return this.http.post<Favorite>(this.apiUrl, newFavorite).pipe(
          tap(fav => console.log('Favorite added successfully:', fav))
        );
      })
    );
  }

  removeFavorite(favoriteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`);
  }
}
