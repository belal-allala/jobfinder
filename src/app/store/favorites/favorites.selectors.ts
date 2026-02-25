import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

// Récupère la tranche "favorites" du store global
export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

// Liste complète des favoris
export const selectAllFavorites = createSelector(
  selectFavoritesState,
  (state) => state.items
);

// Loading state
export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state) => state.loading
);

// OPTIMISATION : Retourne un Set des IDs de jobs favoris
// Permet de vérifier "isFavorite" en O(1) dans les templates
export const selectFavoriteJobIds = createSelector(
  selectAllFavorites,
  (favorites) => new Set(favorites.map(f => f.jobId))
);
