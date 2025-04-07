import { Component } from '@angular/core';
import { ShopService } from '../../../Services/shop.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-viewvoucher',
  templateUrl: './viewvoucher.component.html',
  styleUrls: ['./viewvoucher.component.css']
})
export class ViewvoucherComponent {
  Voucher: any[] = [];
  searchQuery: string = '';
  recognition: any;
  isListening: boolean = false;

  constructor(private service: ShopService, private _router: Router) {
    const SpeechRecognition = webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      let spokenText = event.results[0][0].transcript;
      this.searchQuery = spokenText.trim().replace(/[.,!?]$/, '');
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  ngOnInit() {
    this.gitAllVoucher();
  }

  gitAllVoucher() {
    this.service.getAllVouchers().subscribe((data) => {
      this.Voucher = data;
    });
  }

  get filteredVouchers() {
    if (!this.searchQuery) return this.Voucher;
    return this.Voucher.filter(v =>
      v.code.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  startListening() {
    this.isListening = true;
    this.recognition.start();

    setTimeout(() => {
      this.recognition.stop();
      this.isListening = false;
    }, 5000);
  }

  navigateToEdit(id: any) {
    this._router.navigate(['/dashboard/editvoucher', id]);
  }

  deleteVoucher(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6f91',
      cancelButtonColor: '#ff4c6a',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteVouchers(id).subscribe(() => {
          Swal.fire({
            title: 'Deleted!',
            text: 'Voucher deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#ff6f91'
          });
          this.gitAllVoucher();
        }, error => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while deleting the voucher.',
            icon: 'error',
            confirmButtonColor: '#ff6f91'
          });
        });
      }
    });
  }
}
