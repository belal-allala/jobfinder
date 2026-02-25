import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ApplicationsService } from '../../../core/services/applications.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class JobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private applicationsService = inject(ApplicationsService);
  private authService = inject(AuthService);

  job$!: Observable<Job | undefined>;
  hasApplied: boolean = false;
  applicationSuccess: boolean = false;
  applicationError: string | null = null;
  currentJob: Job | null = null; // Stocke l'objet Job complet

  ngOnInit(): void {
    this.job$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.checkApplicationStatus(id);
          return this.jobService.getJobById(id).pipe(
            tap(job => {
              if (job) {
                this.currentJob = job; // Sauvegarde l'objet Job
              }
            })
          );
        }
        return of(undefined);
      })
    );
  }

  private checkApplicationStatus(jobId: string): void {
    const currentUser = this.authService.currentUserValue();
    if (currentUser && currentUser.id) {
      this.applicationsService.hasUserApplied(currentUser.id, jobId).subscribe({
        next: (applied) => {
          this.hasApplied = applied;
        },
        error: (err) => {
          console.error('Erreur lors de la vérification de la candidature:', err);
        }
      });
    }
  }

  applyForJob(): void {
    if (!this.currentJob) {
      this.applicationError = "Impossible de postuler : Informations de l'offre manquantes.";
      return;
    }

    const currentUser = this.authService.currentUserValue();
    if (!currentUser) {
      this.applicationError = "Vous devez être connecté pour postuler.";
      return;
    }

    this.applicationSuccess = false;
    this.applicationError = null;

    // Passe l'objet Job complet au service
    this.applicationsService.createApplication(this.currentJob).subscribe({
      next: () => {
        this.applicationSuccess = true;
        this.hasApplied = true;
      },
      error: (err) => {
        console.error('Erreur lors de la postulation:', err);
        this.applicationError = "Une erreur est survenue lors de la postulation. Veuillez réessayer.";
      }
    });
  }
}
