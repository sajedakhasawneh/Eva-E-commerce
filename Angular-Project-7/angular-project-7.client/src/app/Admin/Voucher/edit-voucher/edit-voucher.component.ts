import { Component } from '@angular/core';
import { ShopService } from '../../../Services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: ['./edit-voucher.component.css'] // Corrected to styleUrls
})
export class EditVoucherComponent {
  voucherContainer: any;

  constructor(private _url: ShopService, private _active: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    const voucherId = this._active.snapshot.paramMap.get("id");
    this._url.getAllVouchers().subscribe((data: any) => {
      // Assuming you fetch the specific voucher based on ID
      this.voucherContainer = data.find((voucher: any) => voucher.id === voucherId);
    });
  }

  updateVoucher(data: any) {
    const voucherId = this._active.snapshot.paramMap.get("id");

    this._url.editVouchers(voucherId, data).subscribe(() => {
      Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ff6f91' // Custom color for the confirmation button
      });
    });

  }

}
