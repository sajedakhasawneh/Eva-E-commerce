import { Component } from '@angular/core';
import { ShopService } from '../../../Services/shop.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  constructor(private _service: ShopService,  private _route: Router) { }

  ngOnInit() { }

  addNewCategory(data: any) {
    this._service.postToCategories(data).subscribe(() => {
      Swal.fire({
        title: 'Category Added!',
        text: 'The Category has been successfully added.',
        icon: 'success',
        confirmButtonText: 'OK',
        // Soft pink background
        color: '#5a2a2a', // Dark text color for contrast
        confirmButtonColor: '#ff6f91', // A darker pink for the button
      });
      this._route.navigate(['/dashboard/viewCategory']);
    }, error => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add the category. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',

        color: '#5a2a2a',
        confirmButtonColor: '#d81b60',
      });
    })
  }
}
