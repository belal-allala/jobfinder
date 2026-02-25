import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AdzunaResponse, Job, JobSearchCriteria } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.adzuna.baseUrl;
  private readonly APP_ID = environment.adzuna.appId;
  private readonly APP_KEY = environment.adzuna.appKey;

  searchJobs(criteria: JobSearchCriteria): Observable<AdzunaResponse> {
    const country = criteria.country || 'gb';
    const page = criteria.page || 1;
    const resultsPerPage = criteria.results_per_page || 10;

    const url = `${this.API_URL}/jobs/${country}/search/${page}`;

    let params = new HttpParams()
      .set('app_id', this.APP_ID)
      .set('app_key', this.APP_KEY)
      .set('results_per_page', resultsPerPage.toString())
      .set('content-type', 'application/json');

    if (criteria.what) {
      params = params.set('what', criteria.what);
    }

    if (criteria.where) {
      params = params.set('where', criteria.where);
    }

    if (criteria.sort_by) {
      params = params.set('sort_by', criteria.sort_by);
    }

    return this.http.get<AdzunaResponse>(url, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getJobById(id: string): Observable<Job | undefined> {
    const url = `${this.API_URL}/jobs/gb/search/1`; // Recherche sur la première page
    const params = new HttpParams()
      .set('app_id', this.APP_ID)
      .set('app_key', this.APP_KEY)
      .set('what', id) // Recherche par ID dans le champ 'what'
      .set('results_per_page', '1')
      .set('content-type', 'application/json');

    return this.http.get<AdzunaResponse>(url, { params }).pipe(
      map(response => response.results.find(job => job.id === id)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erreur API Adzuna:', error);
    let errorMessage = 'Une erreur inconnue est survenue.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
