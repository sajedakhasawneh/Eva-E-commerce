import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleTranslateService } from './Services/google-translate.service';
import { ShopService } from './Services/shop.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  showLayout: boolean = true;
  isHomePage: boolean = false;
  highestDiscountVoucher: any = null;

  constructor(private router: Router, private googleTranslateService: GoogleTranslateService, private ser: ShopService) {
    //this.router.events.subscribe(() => {
    //  const hiddenRoutes = ['/login', '/signup', '/dashboard'];

    //  this.showLayout = !hiddenRoutes.includes(this.router.url);
    //});

    this.router.events.subscribe(() => {
      const hiddenRoutes = ['/login', '/signup'];

      if (this.router.url.startsWith('/dashboard')) {
        this.showLayout = false; 
      } else {
        this.showLayout = !hiddenRoutes.includes(this.router.url); 
      }
    });
  }

  ngOnInit() {
    this.googleTranslateService.loadGoogleTranslateScript();


    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/';
    });

    this.ser.getAllVouchers().subscribe((vouchers) => {
      if (vouchers.length > 0) {
        this.highestDiscountVoucher = vouchers.reduce((max, voucher) =>
          voucher.discountPercentage > max.discountPercentage ? voucher : max
          , vouchers[0]);
      }
    });
  }
}
