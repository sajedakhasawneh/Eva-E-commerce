import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { ShopService } from '../../Services/shop.service';

@Component({
  selector: 'app-top-rated-products',
  templateUrl: './top-rated-products.component.html',
  styleUrl: './top-rated-products.component.css'
})
export class TopRatedProductsComponent {

  constructor(private ser: ShopService) { }

  ngOnInit(): void {
    this.loadTopRatedProducts();
  }

  topRatedProducts: any[] = [];

  loadTopRatedProducts(): void {
    this.ser.getAllProducts().subscribe(products => {
      this.ser.getAllReviews().subscribe(reviews => {
        const productRatings = this.calculateAverageRatings(products, reviews);
        this.topRatedProducts = productRatings.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5); // Top 5 products
      });
    });
  }

  calculateAverageRatings(products: any[], reviews: any[]): any[] {
    const ratingsMap = new Map();

    reviews.forEach(review => {
      if (!ratingsMap.has(review.productId)) {
        ratingsMap.set(review.productId, { sum: 0, count: 0 });
      }
      const data = ratingsMap.get(review.productId);
      data.sum += review.rating;
      data.count += 1;
    });

    return products.map(product => {
      const ratingData = ratingsMap.get(product.id) || { sum: 0, count: 1 };
      return {
        ...product,
        averageRating: ratingData.sum / ratingData.count,
        totalReviews: ratingData.count
      };
    });
  }
}
