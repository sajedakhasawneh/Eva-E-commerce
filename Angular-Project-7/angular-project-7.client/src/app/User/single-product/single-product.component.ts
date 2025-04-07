import { Component } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css'
})
export class SingleProductComponent {
  constructor(private _ser: ShopService, private activee: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getDet()
  }

  id: any;
  product: any;

  getDet() {
    this.id = this.activee.snapshot.paramMap.get('id');

    this._ser.getAllProducts().subscribe((data) => {
      this.product = data.find((p: any) => p.id == this.id);

      console.log(this.product)
    })
  }

  shareOnFacebook(): void {
    const currentUrl = "https://localhost:52305/Product-Details/1";
    console.log('Current URL:', currentUrl);

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    console.log('Facebook Share URL:', facebookShareUrl);

    const popup = window.open(facebookShareUrl, '_blank', 'width=600,height=400');

    if (!popup) {
      alert("Could not open the share window. Please check your browser's popup settings.");
    } else {
      popup.focus();
    }
  }

  //////////////////////////////////////////

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
