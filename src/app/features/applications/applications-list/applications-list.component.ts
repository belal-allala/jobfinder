import { Component, OnInit, inject } from '@angular/core';
import { ApplicationsService, Application, ApplicationStatus } from '../../../core/services/applications.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.css'
})
export class ApplicationsListComponent implements OnInit {
  private applicationsService = inject(ApplicationsService);

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  public applications$!: Observable<Application[]>;

  ngOnInit(): void {
    this.applications$ = this.refreshTrigger$.pipe(
      switchMap(() => this.applicationsService.getApplicationsForCurrentUser())
    );
  }

  updateStatus(application: Application, newStatus: string): void {
    if (!application.id) return;

    const status = newStatus as ApplicationStatus;

    this.applicationsService.updateApplicationStatus(application.id, status).subscribe({
      next: () => {
        console.log(`Statut mis à jour vers ${status}`);
        this.refreshTrigger$.next();
      },
      error: (err) => console.error('Erreur lors de la mise à jour du statut', err)
    });
  }

  deleteApplication(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      this.applicationsService.deleteApplication(id).subscribe({
        next: () => {
          console.log('Candidature supprimée');
          this.refreshTrigger$.next(); // Recharger la liste
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'INTERVIEW': return 'bg-info text-dark';
      case 'ACCEPTED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'INTERVIEW': return 'Entretien';
      case 'ACCEPTED': return 'Accepté';
      case 'REJECTED': return 'Refusé';
      default: return status;
    }
  }
}
