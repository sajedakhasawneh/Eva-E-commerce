import { Component } from '@angular/core';
import { ShopService } from '../../../Services/shop.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrl: './add-voucher.component.css'
})
export class AddVoucherComponent {

  constructor(private _ser: ShopService) { }

  ngOnInit() { }

  addVoucher(data: any) {
    this._ser.postToVouchers(data).subscribe(() => {
      Swal.fire({
        title: 'Voucher Added!',
        text: 'The voucher has been successfully added.',
        icon: 'success',
        confirmButtonText: 'OK',
         // Soft pink background
        color: '#5a2a2a', // Dark text color for contrast
        confirmButtonColor: '#ff6f91', // A darker pink for the button
      });
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
}
