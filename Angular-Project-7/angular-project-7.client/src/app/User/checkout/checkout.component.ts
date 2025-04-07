import { ChangeDetectorRef, Component } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cartItems: any[] = [];
  loggedInUser: any;
  paymentMethodId: number = 1;
  totalAmount: number = 0;

  constructor(private shopService: ShopService, private http: HttpClient, private route: Router) { }

  ngOnInit(): void {
    //this.cartItems = this.shopService.getCartItems();
    this.shopService.getCartItems().subscribe(
      (items) => {
        this.cartItems = items;
        console.log('Cart Items:', this.cartItems);
      }
    );
    console.log(this.cartItems)
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    this.getLoggedInUser();
    this.getCartItems();
  }

  getLoggedInUser() {
    this.http.get('https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser/1').subscribe(
      (user: any) => {
        this.loggedInUser = user;
      },
      (error) => console.error('Error fetching logged-in user:', error)
    );
  }

  placeOrder() {
    if (!this.loggedInUser) {
      console.error('User not logged in!');
      return;
    }

    // Create Order
    const newOrder = {
      userId: this.loggedInUser.id,
      totalAmount: this.totalAmount,
      createdAt: new Date().toISOString(),
      paymentMethodId: this.paymentMethodId
    };

    this.http.post('https://67d293c190e0670699be2962.mockapi.io/Orders', newOrder).subscribe(
      (orderResponse: any) => {
        console.log('Order Created:', orderResponse);
        this.addOrderItems(orderResponse.id);
        Swal.fire({
          title: 'Order Was Placed!',
          text: 'Your order was placed successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          color: '#5a2a2a',
          confirmButtonColor: '#ff6565',
        });
        this.route.navigate(['/profile']);
      },
      (error) => console.error('Error creating order:', error)
    );
  }

  addOrderItems(orderId: number) {
    const orderItems = this.cartItems.map(item => ({
      orderId: orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.productPrice
    }));

    orderItems.forEach(orderItem => {
      this.http.post('https://67e6d5ac6530dbd31111a268.mockapi.io/OrderItems', orderItem).subscribe(
        (response) => console.log('Order Item Added:', response),
        (error) => console.error('Error adding order item:', error)
      );
    });
  }

  ////////////////////////////////////////////////////////////////////////

  cartId: number = 1;
  finalTotalPrice: number = 0;
  totalPrice: number = 0;
  voucherCode: string = '';
  appliedVoucher: any = null;
  discount: number = 0;
  discountAmount: number = 0;
  errorMessage: string = '';

  loggedInUserID: any;

  getCartItems() {
    this.shopService.getAllCartItems().subscribe(cartData => {
      this.shopService.getAllProducts().subscribe(productsData => {
        this.cartItems = cartData.map(cartItem => {
          const product = productsData.find(p => p.id === cartItem.productId);
          return {
            ...cartItem,
            productName: product ? product.name : 'Unknown Product',
            productPrice: product ? product.price : 0,
            imageUrl: product ? product.image : 'assets/images/placeholder.png'
          };
        });
        this.calculateTotal();
      })
    })
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    this.finalTotalPrice = this.totalPrice;
    if (this.appliedVoucher) {
      this.applyDiscount();
    }
  }

  applyDiscount() {
    this.discountAmount = (this.totalPrice * this.discount) / 100;
    this.finalTotalPrice = this.totalPrice - this.discountAmount;
  }
}
