import { Component } from '@angular/core';
import { ShopService } from '../../../Services/shop.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  productContanier: any;
  categoryId: any;
  selectedId: any = null; // Store selected category ID
  selectedCategoryName: string = 'Category'; // Store selected category name for the button
  category: any[] = [];   // Store category list
  constructor(private _service: ShopService, private _active: ActivatedRoute, private _route: Router) { }

  ngOnInit() {
    this.getData();
    let product = this._active.snapshot.paramMap.get("id");
    this._service.getProductByID(product).subscribe((data) => {
      this.productContanier = data
    })
  }

  getData() {
    this._service.getAllCategories().subscribe((data) => {
      this.category = data;
    });
  }
  

  updateProduct(data: any) {
    this.categoryId = this._active.snapshot.paramMap.get("id");
    this._service.editProducts(this.categoryId, data).subscribe(() => {
      Swal.fire({
        title: 'Success!',
        text: 'Category updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ff6f91' // Custom color for the confirmation button
      });
      this._route.navigate(['/dashboard/viewProduct']);
    })
  }

  getSelectedData(item: any) {
    this.selectedId = item.id;
    this.selectedCategoryName = item.name;  // Update button text with selected category name
  }
}
