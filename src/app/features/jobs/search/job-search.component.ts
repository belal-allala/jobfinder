import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { Job, JobSearchCriteria } from '../../../core/models/job.model';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent {
  private jobService = inject(JobService);
  private fb = inject(FormBuilder);

  searchForm: FormGroup = this.fb.group({
    what: [''],
    where: [''],
    country: ['gb'] // Par défaut UK
  });

  // Observable qui émet les résultats de recherche
  jobs$: Observable<Job[]> = this.searchForm.valueChanges.pipe(
    startWith(this.searchForm.value), // Déclenche une recherche initiale
    switchMap(criteria => {
      // Construction des critères de recherche
      const searchCriteria: JobSearchCriteria = {
        what: criteria.what,
        where: criteria.where,
        country: criteria.country,
        page: 1,
        results_per_page: 10
      };

      // Appel au service
      return this.jobService.searchJobs(searchCriteria).pipe(
        map(response => response.results),
        catchError(err => {
          console.error('Erreur de recherche:', err);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      );
    })
  );
}
