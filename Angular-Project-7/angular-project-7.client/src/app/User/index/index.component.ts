import { Component } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export interface Product {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  price: number;
  discount: string;
  image: string;
  categoryId: number;
  categoryName: string;
  oldPrice: number;
  rating: number;
  reviews: number;
  isFavourite?: boolean;
}


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  categories: any[] = [];
  displayedCategories: any[] = [];
  discountedProducts: any[] = [];

  constructor(private ser: ShopService, private router: Router) { }

  ngOnInit() {
    this.getTopCategories()
    this.getProductsOnSale()
    this.getTopRated()
  }

  getTopCategories() {
    this.ser.getAllCategories().subscribe(categories => {
      this.categories = categories; 
      this.displayedCategories = categories.slice(0, 6);
    });
  }

  getProductsOnSale() {
    this.ser.getAllProducts().subscribe(products => {
      this.discountedProducts = products
        .filter(product => product.discount) 
        .sort((a, b) => this.extractDiscount(b.discount) - this.extractDiscount(a.discount))
        .slice(0, 6);
    });
  }

  extractDiscount(discount: string): number {
    return parseInt(discount.replace('%', '')) || 0; 
  }


  ////Display Top Rated Products
  topRatedProducts: any[] = [];

  getTopRated() {
    this.ser.getTopRatedProducts().subscribe(products => {
      this.topRatedProducts = products;
      console.log(this.topRatedProducts)
    });
  }

  generateStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      '★'.repeat(fullStars) +
      '☆'.repeat(emptyStars)
    );
  }

  calculateOldPrice(price: number, discount: string): string {
    const discountValue = parseFloat(discount);
    if (!isNaN(discountValue) && discountValue > 0) {
      return (price / (1 - discountValue / 100)).toFixed(2);
    }
    return price.toFixed(2);
  }

  ////////////////////////////////////


  cart: any;

  addToCart(product: any) {
    this.ser.getAllCart().subscribe(cartData => {
      this.cart = cartData.find(c => c.userId == 1);

      if (this.cart) {
        const cartData = {
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          quantity: 1,
          cartId: this.cart.id,
          imageUrl: product.image
        };

        this.ser.postToCartItems(cartData).subscribe((response) => {
          console.log('✅ Product added to cart:', response);

          Swal.fire({
            icon: 'success',
            title: 'Added to Cart!',
            text: `${product.name} has been successfully added to your cart.`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff6565'
          });
        });
      } else {
        console.warn("🛒 Cart not found. Creating a new one...");

        const newCart = { userId: 1 };

        this.ser.postToCart(newCart).subscribe((newCartResponse: any) => {
          this.cart = newCartResponse;

          const cartData = {
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            quantity: 1,
            cartId: this.cart.id,
            imageUrl: product.image
          };

          this.ser.postToCartItems(cartData).subscribe((response) => {
            console.log('✅ Product added to new cart:', response);

            Swal.fire({
              icon: 'success',
              title: 'Added to Cart!',
              text: `${product.name} has been successfully added to your cart.`,
              confirmButtonText: 'OK',
              confirmButtonColor: '#ff6565'
            });
          });
        });
      }
    });
  }


  /////////
  productsContainer: any;


  getProductById(productId: number): void {
    const product = this.productsContainer.find(
      (product:any) => product.id == productId
    );

    if (product) {
      const wishlistData = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const isAlreadyInWishlist = wishlistData.some(
        (item: Product) => item.id === product.id
      );

      if (!isAlreadyInWishlist) {
        wishlistData.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlistData));

        Swal.fire({
          title: 'Product added to wishlist!',
          icon: 'success',
          imageUrl: product.image,
          imageWidth: 100,
          imageHeight: 100,
          imageAlt: 'Product Image',
          confirmButtonText: 'Got it!',
          reverseButtons: true,
          confirmButtonColor: '#ff6565',
        }).then((result) => {
          //if (result.isConfirmed) {
          //  window.location.href = '/wishlist';
          //}
        });
      } else {
        Swal.fire({
          title: 'Oops!',
          text: 'You already added this item.',
          icon: 'info',
          showCancelButton: true,
          cancelButtonText: 'Close',
          confirmButtonText: 'Go to Wishlist',
          confirmButtonColor: '#ff6565',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/wishlist';
          }
        });
      }
    }
  }

}
