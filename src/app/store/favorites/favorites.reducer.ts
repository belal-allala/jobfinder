import { createReducer, on } from '@ngrx/store';
import { Favorite } from '../../core/models/favorite.model';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
  favorites: Favorite[];
  loading: boolean;
  error: any;
}

export const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null
};

export const favoritesReducer = createReducer(
  initialState,
  // Load
  on(FavoritesActions.loadFavorites, state => ({ ...state, loading: true, error: null })),
  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({ ...state, favorites, loading: false })),
  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Add
  on(FavoritesActions.addFavorite, state => ({ ...state, loading: true, error: null })),
  on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({ ...state, favorites: [...state.favorites, favorite], loading: false })),
  on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Remove
  on(FavoritesActions.removeFavorite, state => ({ ...state, loading: true, error: null })),
  on(FavoritesActions.removeFavoriteSuccess, (state, { favoriteId }) => ({ ...state, favorites: state.favorites.filter(f => f.id !== favoriteId), loading: false })),
  on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
