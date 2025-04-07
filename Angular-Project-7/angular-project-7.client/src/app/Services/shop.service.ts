import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  orderItems = "https://67e6d5ac6530dbd31111a268.mockapi.io/OrderItems"
  ordersApi = "https://67d293c190e0670699be2962.mockapi.io/Orders"

  vouchersApi = "https://67e310df97fc65f53538a048.mockapi.io/Voucher"
  cartItem = "https://67e310df97fc65f53538a048.mockapi.io/cartItem"
  productsApi = "https://67e3163997fc65f53538b2c5.mockapi.io/Product"
  cartApi = "https://67e3163997fc65f53538b2c5.mockapi.io/Cart"
  categoriesApi = "https://67e3178397fc65f53538b76f.mockapi.io/Category"
  reviewsApi = "https://67d61653286fdac89bc11c6d.mockapi.io/reviews"

  constructor(private http: HttpClient) { }

  getAllOrders() {
    return this.http.get<any[]>(this.ordersApi)///////////////////////
  }

  getUserOrders(id: any) {
    return this.http.get(`${this.ordersApi}/${id}`)
  }
  ///
  getAllOrderItems() {
    return this.http.get<any[]>(this.orderItems)
  }

  postToOrderItems(data: any) {
    return this.http.post(this.orderItems, data)
  }

  editOrderItems(id: any, data: any) {
    return this.http.put(`${this.orderItems}/${id}`, data)
  }

  deleteOrderItems(id: any) {
    return this.http.delete(`${this.orderItems}/${id}`)
  }

  ///

  getAllVouchers() {
    return this.http.get<any[]>(this.vouchersApi)
  }

  postToVouchers(data: any) {
    return this.http.post(this.vouchersApi, data)
  }

  editVouchers(id: any, data: any) {
    return this.http.put(`${this.vouchersApi}/${id}`, data)
  }

  deleteVouchers(id: any) {
    return this.http.delete(`${this.vouchersApi}/${id}`)
  }

  ///

  getAllCartItems() {
    return this.http.get<any[]>(this.cartItem)
  }

  postToCartItems(data: any) {
    return this.http.post(this.cartItem, data)
  }

  editCartItems(id: any, data: any) {
    return this.http.put(`${this.cartItem}/${id}`, data)
  }

  deleteCartItems(id: any) {
    return this.http.delete(`${this.cartItem}/${id}`)
  }

  ///

  getAllProducts() {
    return this.http.get<any[]>(this.productsApi)
  }

  postToProducts(data: any) {
    return this.http.post(this.productsApi, data)
  }

  editProducts(id: any, data: any) {
    return this.http.put(`${this.productsApi}/${id}`, data)
  }

  deleteProducts(id: any) {
    return this.http.delete(`${this.productsApi}/${id}`)
  }

  getProductByID(id: any) {
    return this.http.get(`${this.productsApi}/${id}`)
  }
  ///

  getAllCart() {
    return this.http.get<any[]>(this.cartApi)
  }

  postToCart(data: any) {
    return this.http.post(this.cartApi, data)
  }

  editCart(id: any, data: any) {
    return this.http.put(`${this.cartApi}/${id}`, data)
  }

  deleteCart(id: any) {
    return this.http.delete(`${this.cartApi}/${id}`)
  }

  ///

  getAllCategories() {
    return this.http.get<any[]>(this.categoriesApi)
  }

  postToCategories(data: any) {
    return this.http.post(this.categoriesApi, data)
  }

  editCategory(id: any, data: any) {
    return this.http.put(`${this.categoriesApi}/${id}`, data)
  }

  deleteCategory(id: any) {
    return this.http.delete(`${this.categoriesApi}/${id}`)
  }

  getCategoryByCategoryId(id: any) {
    return this.http.get(`${this.categoriesApi}/${id}`)
  }
  ///

  getAllReviews() {
    return this.http.get<any[]>(this.reviewsApi)
  }

  postToReviews(data: any) {
    return this.http.post(this.reviewsApi, data)
  }

  deleteReview(id: any) {
    return this.http.delete(`${this.reviewsApi}/${id}`)
  }

  updateReview(updatedReviewData: any) {
    const url = `${this.reviewsApi}/${updatedReviewData.id}`;
    return this.http.put(url, updatedReviewData);
  }

  ///Top rated products
  getTopRatedProducts(limit: number = 6) {
    return forkJoin({
      products: this.getAllProducts(),
      reviews: this.getAllReviews()
    }).pipe(
      map(({ products, reviews }) => {
        const productRatings: { [key: number]: { total: number; count: number } } = {};

        reviews.forEach(review => {
          if (!productRatings[review.productId]) {
            productRatings[review.productId] = { total: 0, count: 0 };
          }
          productRatings[review.productId].total += review.rating;
          productRatings[review.productId].count += 1;
        });

        const ratedProducts = products.map(product => {
          const ratingData = productRatings[product.id] || { total: 0, count: 1 };
          return {
            ...product,
            avgRating: ratingData.total / ratingData.count,
            reviewCount: ratingData.count
          };
        });

        return ratedProducts.sort((a, b) => b.avgRating - a.avgRating).slice(0, limit);
      })
    );
  }

  ///
  contactUS = "https://67de95b4471aaaa74284f2c6.mockapi.io/contactus"
  getMessages() {
    return this.http.get<any[]>(this.contactUS);
  }
  postMessages(data: any) {
    return this.http.post(this.contactUS, data);
  }
  sendReply(email: string, message: string) {
    return this.http.post(`${this.contactUS}/send-reply`, { email, message });
  }

  /////////////////////////////////////////////////Checkout

  private cartItems: any[] = []; 

  setCartItems(items: any[]) {
    this.cartItems = items;
  }

  getCartItems(): Observable<any[]> {
    return of(this.cartItems);
  }
}
