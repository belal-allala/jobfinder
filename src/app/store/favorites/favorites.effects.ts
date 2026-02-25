import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FavoritesService } from '../../core/services/favorites.service';
import * as FavoritesActions from './favorites.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private favoritesService = inject(FavoritesService);

  loadFavorites$ = createEffect(() => this.actions$.pipe(
    ofType(FavoritesActions.loadFavorites),
    mergeMap(() => this.favoritesService.getFavorites().pipe(
      map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
      catchError(error => of(FavoritesActions.loadFavoritesFailure({ error })))
    ))
  ));

  addFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(FavoritesActions.addFavorite),
    mergeMap(action => this.favoritesService.addFavorite(action.job).pipe(
      map(favorite => FavoritesActions.addFavoriteSuccess({ favorite })),
      catchError(error => of(FavoritesActions.addFavoriteFailure({ error })))
    ))
  ));

  removeFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(FavoritesActions.removeFavorite),
    mergeMap(action => this.favoritesService.removeFavorite(action.favoriteId).pipe(
      map(() => FavoritesActions.removeFavoriteSuccess({ favoriteId: action.favoriteId })),
      catchError(error => of(FavoritesActions.removeFavoriteFailure({ error })))
    ))
  ));
}
