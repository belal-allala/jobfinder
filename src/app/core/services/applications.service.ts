import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Job } from '../models/job.model';

// Définition des statuts possibles
export type ApplicationStatus = 'PENDING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id?: string;
  jobId: string;
  userId: string;
  job?: Job;
  appliedDate?: string;
  status: ApplicationStatus;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private apiUrl = 'http://localhost:3000/applications';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() { }

  getApplicationsForCurrentUser(): Observable<Application[]> {
    const currentUser = this.authService.currentUserValue();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${currentUser.id}`);
  }

  createApplication(job: Job): Observable<Application> {
    const currentUser = this.authService.currentUserValue();
    if (!currentUser || !currentUser.id) {
      throw new Error('User not logged in.');
    }

    const newApplication: Application = {
      userId: currentUser.id,
      jobId: job.id,
      job: job,
      appliedDate: new Date().toISOString(),
      status: 'PENDING'
    };

    return this.http.post<Application>(this.apiUrl, newApplication);
  }

  hasUserApplied(userId: string, jobId: string): Observable<boolean> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&jobId=${jobId}`).pipe(
      map(applications => applications.length > 0)
    );
  }

  updateApplicationStatus(id: string, status: ApplicationStatus): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
  }

  // Nouvelle méthode pour supprimer une candidature
  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
