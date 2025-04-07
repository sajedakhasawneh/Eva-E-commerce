import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  selector: 'app-shope',
  templateUrl: './shope.component.html',
  styleUrls: ['./shope.component.css'],
})
export class ShopeComponent implements OnInit {
  categoriesContainer: any[] = [];
  productsContainer: Product[] = [];
  filteredProducts: Product[] = [];
  filteredProductsById: Product[] = [];
  reviews: any[] = [];
  searchQuery: string = '';

  constructor(private _ser: ShopService, private router: Router) { }

  ngOnInit() {
    this.fetchCategories();
    this.fetchProducts();
  }

  getStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    for (let i = fullStars; i < 5; i++) {
      stars.push(0);
    }
    return stars;
  }

  fetchCategories(): void {
    this._ser.getAllCategories().subscribe(
      (data) => {
        this.categoriesContainer = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  fetchProducts(): void {
    this._ser.getAllProducts().subscribe(
      (data) => {
        this._ser.getAllReviews().subscribe((reviews) => {
          this.productsContainer = data.map((product) => {
            const productReviews = reviews.filter(
              (review) => review.productId == product.id
            );
            product.reviews = productReviews.length;
            product.rating =
              productReviews.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / productReviews.length || 0;
            return product;
          });
          this.filteredProducts = this.productsContainer;
        });
      },
      (error) => {
        console.error('Error fetching Products:', error);
      }
    );
  }

  getProductById(productId: number): void {
    const product = this.productsContainer.find(
      (product) => product.id == productId
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

  filterProductsByCategory(categoryId: number): void {
    if (categoryId) {
      this.filteredProducts = this.productsContainer.filter(
        (product) => product.categoryId == categoryId
      );
    } else {
      this.filteredProducts = [...this.productsContainer];
    }
  }

  onCategoryChange(event: any) {
    const selectedCategoryId = event.target.value;
    this.filterProductsByCategory(selectedCategoryId);
  }

  onSearchChange(): void {
    if (this.searchQuery.trim()) {
      this.filteredProducts = this.productsContainer.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.productsContainer];
    }
  }

  startVoiceSearch(): void {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      let transcript = event.results[0][0].transcript.trim();
      if (transcript.endsWith('.')) {
        transcript = transcript.slice(0, -1);
      }
      this.searchQuery = transcript;
      this.onSearchChange();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
    };

    recognition.start();
  }

  sortProducts(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const criteria = selectElement.value;
    if (!criteria) return;

    switch (criteria) {
      case 'low-high':
        this.filteredProducts = [...this.filteredProducts].sort(
          (a, b) => a.price - b.price
        );
        break;
      case 'high-low':
        this.filteredProducts = [...this.filteredProducts].sort(
          (a, b) => b.price - a.price
        );
        break;
      case 'new-old':
        this.filteredProducts = [...this.filteredProducts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'old-new':
        this.filteredProducts = [...this.filteredProducts].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'az':
        this.filteredProducts = [...this.filteredProducts].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case 'za':
        this.filteredProducts = [...this.filteredProducts].sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;
      default:
        break;
    }
  }


  //////////////////////////////////////////////////////////

  cart: any;

  addToCart(product: any) {
    this._ser.getAllCart().subscribe(cartData => {
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

        this._ser.postToCartItems(cartData).subscribe((response) => {
          console.log('✅ Product added to cart:', response);

          // Show success swal notification with "Go to Cart" and "Close" buttons
          Swal.fire({
            icon: 'success',
            title: 'Product added to cart!',
            text: 'You can view your cart now.',
            showCancelButton: true,
            confirmButtonText: 'Go to Cart',
            confirmButtonColor: '#ff6565',
            cancelButtonText: 'Close',
            focusCancel: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Navigate to cart if "Go to Cart" is clicked
              this.router.navigate(['/cart'], { queryParams: { productId: product.id } });
            } else {
              // Close the alert if "Close" is clicked
              Swal.close();
            }
          });
        });
      } else {
        console.error("❌ Cart not found for user. Creating a new cart...");

        const newCart = { userId: 1 };

        this._ser.postToCart(newCart).subscribe((newCartResponse: any) => {
          this.cart = newCartResponse;

          const cartData = {
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            quantity: 1,
            cartId: this.cart.id,
            imageUrl: product.image
          };

          this._ser.postToCartItems(cartData).subscribe((response) => {
            console.log('✅ Product added to new cart:', response);

            // Show success swal notification with "Go to Cart" and "Close" buttons
            Swal.fire({
              icon: 'success',
              title: 'Product added to cart!',
              text: 'You can view your cart now.',
              showCancelButton: true,
              confirmButtonText: 'Go to Cart',
              confirmButtonColor: '#ff6565',
              cancelButtonText: 'Close',
              focusCancel: true
            }).then((result) => {
              if (result.isConfirmed) {
                // Navigate to cart if "Go to Cart" is clicked
                this.router.navigate(['/cart'], { queryParams: { productId: product.id } });
              } else {
                // Close the alert if "Close" is clicked
                Swal.close();
              }
            });
          });
        });
      }
    });
  }


  ////////////////////////////////////////////////////////////////////////////////////
}
