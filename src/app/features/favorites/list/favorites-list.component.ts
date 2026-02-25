import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Favorite } from '../../../core/models/favorite.model';
import { loadFavorites, removeFavorite } from '../../../store/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.css']
})
export class FavoritesListComponent implements OnInit {
  private store = inject(Store);

  favorites$: Observable<Favorite[]> = this.store.select(selectAllFavorites);
  loading$: Observable<boolean> = this.store.select(selectFavoritesLoading);

  ngOnInit(): void {
    this.store.dispatch(loadFavorites());
  }

  remove(favoriteId: string | undefined): void {
    if (favoriteId) {
      if (confirm('Voulez-vous vraiment retirer cette offre de vos favoris ?')) {
        this.store.dispatch(removeFavorite({ favoriteId }));
      }
    }
  }
}
