import { Component } from '@angular/core';
import { Product } from '../shope/shope.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  filteredProductsById: Product[] = [];

  ngOnInit(): void {
    const wishlistData = localStorage.getItem('wishlist');
    if (wishlistData) {
      this.filteredProductsById = JSON.parse(wishlistData);
    }
  }

  removeFromWishlist(productId: number): void {
    this.filteredProductsById = this.filteredProductsById.filter(product => product.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(this.filteredProductsById));
  }
}
