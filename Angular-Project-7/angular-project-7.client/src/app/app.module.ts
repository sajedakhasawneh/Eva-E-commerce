import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './User/index/index.component';
import { AboutComponent } from './User/about/about.component';
import { ContactComponent } from './User/contact/contact.component';
import { ShopeComponent } from './User/shope/shope.component';
import { ProductsComponent } from './User/products/products.component';
import { SingleProductComponent } from './User/single-product/single-product.component';
import { CategoriesComponent } from './User/categories/categories.component';
import { ProfileComponent } from './User/profile/profile.component';
import { EditProfileComponent } from './User/edit-profile/edit-profile.component';
import { OrdersHistoryComponent } from './User/orders-history/orders-history.component';
import { CartComponent } from './User/cart/cart.component';
import { LoginComponent } from './User/login/login.component';
import { SignUpComponent } from './User/sign-up/sign-up.component';
import { NavbarComponent } from './User/navbar/navbar.component';
import { FooterComponent } from './User/footer/footer.component';
import { SidebarComponent } from './User/sidebar/sidebar.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { AddCategoryComponent } from './Admin/Category/add-category/add-category.component';
import { EditCategoryComponent } from './Admin/Category/edit-category/edit-category.component';
import { AddProductComponent } from './Admin/Product/add-product/add-product.component';
import { EditProductComponent } from './Admin/Product/edit-product/edit-product.component';
import { AddVoucherComponent } from './Admin/Voucher/add-voucher/add-voucher.component';
import { EditVoucherComponent } from './Admin/Voucher/edit-voucher/edit-voucher.component';
import { UpdateVoucherComponent } from './Admin/Voucher/update-voucher/update-voucher.component';
import { ViewUsersComponent } from './Admin/view-users/view-users.component';
//import { InboxComponent } from './Admin/inbox/inbox.component';
import { DiscountComponent } from './Admin/discount/discount.component';
import { ViewvoucherComponent } from './Admin/Voucher/viewvoucher/viewvoucher.component';
import { SendReplyComponent } from './Admin/send-reply/send-reply.component';
import { ViewCategoryComponent } from './Admin/Category/view-category/view-category.component';
import { ViewProductComponent } from './Admin/Product/view-product/view-product.component';
import { ReviewsComponent } from './User/reviews/reviews.component';
import { WishlistComponent } from './User/wishlist/wishlist.component';
import { TopRatedProductsComponent } from './User/top-rated-products/top-rated-products.component';
import { OrderItemsComponent } from './User/order-items/order-items.component';
import { TestComponent } from './User/test/test.component';
//import { SendReplyComponent } from './Admin/send-reply/send-reply.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AboutComponent,
    ContactComponent,
    ShopeComponent,
    ProductsComponent,
    SingleProductComponent,
    CategoriesComponent,
    ProfileComponent,
    EditProfileComponent,
    OrdersHistoryComponent,
    CartComponent,
    LoginComponent,
    SignUpComponent,
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    AddProductComponent,
    EditProductComponent,
    AddVoucherComponent,
    EditVoucherComponent,
    UpdateVoucherComponent,
    ViewUsersComponent,
    //InboxComponent,
    DiscountComponent,
    ViewvoucherComponent,
    SendReplyComponent,
    ViewCategoryComponent,
    ViewProductComponent,
    ReviewsComponent,
    WishlistComponent,
    TopRatedProductsComponent,
    OrderItemsComponent,
    TestComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
