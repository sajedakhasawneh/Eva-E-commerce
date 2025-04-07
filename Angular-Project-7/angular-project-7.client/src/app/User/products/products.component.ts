import { Component } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  constructor(private _ser: ShopService, private _active: ActivatedRoute) { }



  ngOnInit() {
    this.showProduct();
  }

  categoryid: any;
  getProducts: any;
  showProduct() {
    this.categoryid = this._active.snapshot.paramMap.get("id");
    this._ser.getAllProducts().subscribe((data) => {
      if (this.categoryid) {
        this.getProducts = data.filter((p: any) => p.categoryId == this.categoryid);
        console.log(this.getProducts);
      }
    });
  }
}
