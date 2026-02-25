import { createReducer, on } from '@ngrx/store';
import { Favorite } from '../../core/models/favorite.model';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
  items: Favorite[];
  loading: boolean;
  error: any;
}

export const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null
};

export const favoritesReducer = createReducer(
  initialState,

  // Load
  on(FavoritesActions.loadFavorites, state => ({ ...state, loading: true, error: null })),
  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    items: favorites,
    loading: false
  })),

  // Add
  on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    items: [...state.items, favorite], // Ajout immuable
    loading: false
  })),

  // Remove
  on(FavoritesActions.removeFavoriteSuccess, (state, { favoriteId }) => ({
    ...state,
    items: state.items.filter(f => f.id !== favoriteId), // Suppression immuable
    loading: false
  })),

  // Gestion des erreurs (générique pour l'exemple)
  on(FavoritesActions.loadFavoritesFailure,
     FavoritesActions.addFavoriteFailure,
     FavoritesActions.removeFavoriteFailure,
     (state, { error }) => ({ ...state, error, loading: false }))
);
