import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.favorites
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.error
);

// Sélecteur pour vérifier si un job est déjà en favori (O(1) lookup)
export const selectFavoriteJobIds = createSelector(
  selectAllFavorites,
  (favorites) => new Set(favorites.map(f => f.jobId))
);
