import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShopService } from '../../Services/shop.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.css'
})
export class OrderItemsComponent {
  constructor(private ser: UserService, private _ser: ShopService, private route: Router, private router: HttpClient, private Activep: ActivatedRoute) { }

  ngOnInit() {
    this.getOrders();
    this.getUserOrders();
    this.getOrderrItems();
  }

  UserOrderss: any
  Orders: any
  UserID: any
  Useremail: any
  Order: any
  orderItems: any

  getUserOrders() {
    this.ser.getUser().pipe(
      switchMap((user: any) => {
        this.Useremail = user.email;
        return this.ser.getAllUsers();
      })
    ).subscribe(users => {
      let user = users.find((u: any) => u.email === this.Useremail);

      if (user) {
        this.UserID = user.id;
        console.log("User ID:", this.UserID);

        this._ser.getAllOrders().subscribe((data) => {
          this.UserOrderss = data.filter((Orders: any) => Orders.userId == this.UserID);
        });

      } else {
        console.log("User not found!");
      }
    });
  }
  getOrders() {
    this._ser.getAllOrders().subscribe((data) => {
      this.Orders = data;
    })
  }
  getOrderrItems() {
    this.Order = this.Activep.snapshot.paramMap.get('id');

    this._ser.getAllOrderItems().subscribe((orderItemsData) => {
      this._ser.getAllProducts().subscribe((productsData) => {

        this.orderItems = orderItemsData
          .filter((item: any) => item.orderId == this.Order) 
          .map((item: any) => {
            let product = productsData.find((p: any) => p.id == item.productId); 

            if (!product) return null;

            return {
              ...item,
              productName: product.name,
              productImage: product.image,
              productprice: product.price,
              quantity: item.quantity
            };
          })
          .filter(item => item !== null); 

        console.log("Final Order Items:", this.orderItems);
      });
    });
  }

}
