import { Component } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  ///////////////////

  cartId: number = 1;
  finalTotalPrice: number = 0;
  cartItems: any[] = [];
  totalPrice: number = 0;
  voucherCode: string = '';
  appliedVoucher: any = null;
  discount: number = 0;
  discountAmount: number = 0;
  totalAmount: number = 0;
  errorMessage: string = '';

  constructor(private shopService: ShopService, private router: Router) { }

  ngOnInit(): void {
    this.getCartItems();
  }
  /////////////////////////////////////////////////

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

  removeFromCart(id: any) {
    this.shopService.deleteCartItems(id).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== id);
      this.calculateTotal();
    });
  }

  updateQuantity(item: any, newQuantity: number) {
    if (newQuantity < 1) return;

    item.quantity = newQuantity;
    item.total = item.quantity * item.productPrice;

    this.shopService.editCartItems(item.id, item).subscribe(() => {
      this.calculateTotal();
    });


  }


  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    this.finalTotalPrice = this.totalPrice;
    if (this.appliedVoucher) {
      this.applyDiscount();
    }
  }


  applyVoucher() {
    if (!this.voucherCode.trim()) {
      this.errorMessage = ' Please enter a voucher code 🎟️  ';
      return;
    }

    this.shopService.getAllVouchers().subscribe(
      (vouchers) => {
        const voucher = vouchers.find((v) => v.code === this.voucherCode);
        if (voucher) {
          const currentDate = new Date();
          const expiryDate = new Date(voucher.expiryDate);

          if (expiryDate >= currentDate) {
            this.appliedVoucher = voucher;
            this.discount = voucher.discountPercentage;
            this.errorMessage = '';
            this.applyDiscount();
          } else {
            this.errorMessage = '  The voucher has expired 🎟️';
            this.appliedVoucher = null;
          }
        } else {
          this.errorMessage = '  The voucher code is incorrect  🎟️ ';
          this.appliedVoucher = null;
        }
      }
    );
  }

  applyDiscount() {
    this.discountAmount = (this.totalPrice * this.discount) / 100;
    this.finalTotalPrice = this.totalPrice - this.discountAmount;
  }

  ///////////////////////////////////////////////////////////////Checkout
  goToCheckout() {
    this.shopService.setCartItems(this.cartItems);
    console.log(this.cartItems)
    this.router.navigate(['/checkout']);
  }
}
