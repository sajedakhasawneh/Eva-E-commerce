import { Component } from '@angular/core';
import { ShopService } from '../../../Services/shop.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  category: any[] = [];   // Store category list
  selectedId: any = null; // Store selected category ID
  selectedCategoryName: string = 'Category'; // Store selected category name for the button

  constructor(private _shop: ShopService, private _route: Router) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this._shop.getAllCategories().subscribe((data) => {
      this.category = data;
    });
  }

  addNewProduct(data: any) {
    data.categoryId = this.selectedId;
    this._shop.postToProducts(data).subscribe(() => {
      Swal.fire({
        title: 'Product Added!',
        text: 'The Product has been successfully added.',
        icon: 'success',
        confirmButtonText: 'OK',
        // Soft pink background
        color: '#5a2a2a', // Dark text color for contrast
        confirmButtonColor: '#ff6f91', // A darker pink for the button
      });
      this._route.navigate(['/dashboard/viewProduct']);
    }, error => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add the voucher. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',

        color: '#5a2a2a',
        confirmButtonColor: '#d81b60',
      });
    });
  }
  

  getSelectedData(item: any) {
    this.selectedId = item.id;
    this.selectedCategoryName = item.name;  // Update button text with selected category name
  }
}
