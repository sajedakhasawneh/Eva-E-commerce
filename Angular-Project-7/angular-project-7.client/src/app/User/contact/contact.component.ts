import { Component } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private _ser: ShopService) { }

  ngOnInit() { }

  submitContactForm(formData: any) {
    this._ser.postMessages(formData).subscribe(
      () => {
        this.successMessage = 'Your message has been sent successfully!';
        this.errorMessage = ''; 
        Swal.fire({
          title: 'Success!',
          text: this.successMessage,
          icon: 'success',
          confirmButtonText: 'Okay',
          confirmButtonColor: '#ff6565'
        });
      },
      () => {
        this.errorMessage = 'There was an issue sending your message. Please try again.';
        this.successMessage = ''; 
        Swal.fire({
          title: 'Error!',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonText: 'Okay',
          confirmButtonColor: '#ff6565',
        });
      }
    );
  }
}
