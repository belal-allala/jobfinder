import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { JobSearchComponent } from './features/jobs/search/job-search.component';
import { FavoritesListComponent } from './features/favorites/list/favorites-list.component';
import { authGuard } from './core/guards/auth.guard';
import { JobDetailComponent } from './features/jobs/details/job-detail.component';
import { ApplicationsListComponent } from './features/applications/applications-list/applications-list.component'; // Importez le composant

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'jobs/search', component: JobSearchComponent, canActivate: [authGuard] },
  { path: 'job/:id', component: JobDetailComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesListComponent, canActivate: [authGuard] },
  { path: 'my-applications', component: ApplicationsListComponent, canActivate: [authGuard] }, // Nouvelle route pour les candidatures
  { path: '', redirectTo: '/jobs/search', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
