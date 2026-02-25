import { Job } from './job.model';

export interface Favorite {
  id?: string; // ID généré par JSON Server
  userId: string;
  jobId: string; // Pour vérification rapide d'unicité
  job: Job; // Stockage de l'objet complet pour affichage
  createdAt: string;
}
