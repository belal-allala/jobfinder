import { createAction, props } from '@ngrx/store';
import { Favorite } from '../../core/models/favorite.model';
import { Job } from '../../core/models/job.model';

// --- Load ---
export const loadFavorites = createAction('[Favorites] Load Favorites');
export const loadFavoritesSuccess = createAction('[Favorites] Load Success', props<{ favorites: Favorite[] }>());
export const loadFavoritesFailure = createAction('[Favorites] Load Failure', props<{ error: any }>());

// --- Add ---
export const addFavorite = createAction('[Favorites] Add Favorite', props<{ job: Job }>());
export const addFavoriteSuccess = createAction('[Favorites] Add Success', props<{ favorite: Favorite }>());
export const addFavoriteFailure = createAction('[Favorites] Add Failure', props<{ error: any }>());

// --- Remove ---
export const removeFavorite = createAction('[Favorites] Remove Favorite', props<{ favoriteId: string }>());
export const removeFavoriteSuccess = createAction('[Favorites] Remove Success', props<{ favoriteId: string }>());
export const removeFavoriteFailure = createAction('[Favorites] Remove Failure', props<{ error: any }>());
