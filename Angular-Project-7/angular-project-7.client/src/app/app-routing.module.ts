import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './User/index/index.component';
import { AboutComponent } from './User/about/about.component';
import { ProfileComponent } from './User/profile/profile.component';
import { EditProfileComponent } from './User/edit-profile/edit-profile.component';
import { ShopeComponent } from './User/shope/shope.component';
import { LoginComponent } from './User/login/login.component';
import { SignUpComponent } from './User/sign-up/sign-up.component';
import { SingleProductComponent } from './User/single-product/single-product.component';
import { ProductsComponent } from './User/products/products.component';
import { CategoriesComponent } from './User/categories/categories.component';
import { CartComponent } from './User/cart/cart.component';
import { ContactComponent } from './User/contact/contact.component';
import { CheckoutComponent } from './User/checkout/checkout.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ViewvoucherComponent } from './Admin/Voucher/viewvoucher/viewvoucher.component';
import { AddVoucherComponent } from './Admin/Voucher/add-voucher/add-voucher.component';
import { EditVoucherComponent } from './Admin/Voucher/edit-voucher/edit-voucher.component';
import { UpdateVoucherComponent } from './Admin/Voucher/update-voucher/update-voucher.component';
import { ViewUsersComponent } from './Admin/view-users/view-users.component';
import { AddCategoryComponent } from './Admin/Category/add-category/add-category.component';
import { ViewCategoryComponent } from './Admin/Category/view-category/view-category.component';
import { EditCategoryComponent } from './Admin/Category/edit-category/edit-category.component';
import { AddProductComponent } from './Admin/Product/add-product/add-product.component';
import { ViewProductComponent } from './Admin/Product/view-product/view-product.component';
import { EditProductComponent } from './Admin/Product/edit-product/edit-product.component';
import { SendReplyComponent } from './Admin/send-reply/send-reply.component';
import { ReviewsComponent } from './User/reviews/reviews.component';
import { WishlistComponent } from './User/wishlist/wishlist.component';
import { OrderItemsComponent } from './User/order-items/order-items.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: "about", component: AboutComponent },
  { path: "profile", component: ProfileComponent },
  { path: "editProfile", component: EditProfileComponent },

  { path: "contact", component: ContactComponent },
  { path: "about", component: AboutComponent },
  { path: "shope", component: ShopeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignUpComponent },
  { path: "Product-Details/:id", component: SingleProductComponent },
  { path: "Product/:id", component: ProductsComponent },
  { path: "category", component: CategoriesComponent },
  { path: "cart", component: CartComponent },
  { path: "checkout", component: CheckoutComponent },
  {
    path: "dashboard", component: DashboardComponent, children: [
      { path: "viewvoucher", component: ViewvoucherComponent },
      { path: "addvoucher", component: AddVoucherComponent },
      { path: "editvoucher/:id", component: EditVoucherComponent },
      { path: "updatevoucher", component: UpdateVoucherComponent },
      { path: "allUser", component: ViewUsersComponent },
      { path: "addCategory", component: AddCategoryComponent },
      { path: "viewCategory", component: ViewCategoryComponent },
      { path: "editCategory/:id", component: EditCategoryComponent },
      { path: "addProduct", component: AddProductComponent },
      { path: "viewProduct", component: ViewProductComponent },
      { path: "editProduct/:id", component: EditProductComponent },
      { path: "sendreply", component: SendReplyComponent }

    ]
  },
  { path: "reviews/:id", component: ReviewsComponent },
  { path: "wishlist", component: WishlistComponent },
  { path: "order-items/:id", component: OrderItemsComponent }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
