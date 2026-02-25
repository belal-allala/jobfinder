import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { Job, JobSearchCriteria } from '../../../core/models/job.model';
import { Observable, of, Subject, merge } from 'rxjs';
import { catchError, map, startWith, switchMap, tap, shareReplay, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { addFavorite, loadFavorites } from '../../../store/favorites/favorites.actions';
import { selectFavoriteJobIds } from '../../../store/favorites/favorites.selectors';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit {
  private jobService = inject(JobService);
  private fb = inject(FormBuilder);
  private store = inject(Store);

  currentPage = 1;
  resultsPerPage = 10;
  private pageAction$ = new Subject<number>();

  favoriteJobIds$ = this.store.select(selectFavoriteJobIds);

  searchForm: FormGroup = this.fb.group({
    what: [''],
    where: [''],
    country: ['gb'],
    sort_by: ['relevance']
  });

  jobs$!: Observable<Job[]>;
  totalCount$!: Observable<number>;
  totalPages$!: Observable<number>;

  constructor() {
    // Flux de changement de critères (déclenche une nouvelle recherche page 1)
    const criteriaChange$ = this.searchForm.valueChanges.pipe(
      startWith(this.searchForm.value),
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      tap(() => this.currentPage = 1),
      map(() => 1)
    );

    // Flux de changement de page
    const pageChange$ = this.pageAction$.pipe(
      tap(page => this.currentPage = page)
    );

    // Flux combiné : soit changement de critères, soit changement de page
    const searchTrigger$ = merge(criteriaChange$, pageChange$);

    const searchResponse$ = searchTrigger$.pipe(
      switchMap(page => {
        const formValue = this.searchForm.value;
        const criteria: JobSearchCriteria = {
          what: formValue.what,
          where: formValue.where,
          country: formValue.country,
          sort_by: formValue.sort_by,
          page: page,
          results_per_page: this.resultsPerPage
        };
        return this.jobService.searchJobs(criteria).pipe(
          catchError(err => {
            console.error('Erreur de recherche:', err);
            return of({ results: [], count: 0, mean: 0, __CLASS__: '' });
          })
        );
      }),
      shareReplay(1)
    );

    this.jobs$ = searchResponse$.pipe(map(res => res.results));
    this.totalCount$ = searchResponse$.pipe(map(res => res.count));
    this.totalPages$ = this.totalCount$.pipe(
      map(count => Math.ceil(count / this.resultsPerPage))
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadFavorites());
  }

  addToFavorites(job: Job): void {
    this.store.dispatch(addFavorite({ job }));
  }

  changePage(page: number): void {
    this.pageAction$.next(page);
    window.scrollTo(0, 0);
  }
}
