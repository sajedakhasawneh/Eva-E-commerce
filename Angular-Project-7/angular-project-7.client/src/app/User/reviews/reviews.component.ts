import { Component } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../Services/user.service';
import Swal from 'sweetalert2';

interface Review {
  userId: string;
  name: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  id: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  reviews: Review[] = [];
  users: User[] = [];
  starsFilled: boolean[] = [false, false, false, false, false];
  totalReviews: number = 0;
  loggedInUserId: string | null = null;
  productId!: number;
  currentRating: number = 0;
  newReview = { comment: '' };
  averageRating: number = 0;
  stars: number[] = [];
  editingReview: Review | null = null;
  isEditing: boolean = false;

  constructor(private route: ActivatedRoute, private _ser: ShopService, private userService: UserService) { }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.getLoggedInUser();
    this.loadReviews();
  }

  getLoggedInUser(): void {
    this.userService.getLoggedInUsers().subscribe(data => {
      if (data && data.length > 0) {
        this.loggedInUserId = data[0].id;
      }
    });
  }

  isUserReview(userId: string): boolean {
    return this.loggedInUserId === userId;
  }

  editReview(review: Review): void {
    this.isEditing = true;
    this.editingReview = { ...review };
    this.newReview.comment = review.comment;
    this.currentRating = review.rating;
  }

  submitEditedReview(updatedReviewData: any): void {
    if (this.editingReview) {
      updatedReviewData.id = this.editingReview.id;
      this._ser.updateReview(updatedReviewData).subscribe(
        response => {
          Swal.fire({
            title: 'Success!',
            text: 'Your review has been updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.loadReviews();
          this.resetForm();
          this.isEditing = false;
        },
        error => {
          Swal.fire({
            title: 'Error!',
            text: 'There was an error updating your review. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }

  deleteReview(reviewId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this._ser.deleteReview(reviewId).subscribe(() => {
          this.reviews = this.reviews.filter(r => r.id !== reviewId);
          this.totalReviews = this.reviews.length;
          this.calculateAverageRating();
        }, error => {
          console.error('Error deleting review:', error);
        });
      }
    });
  }

  calculateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      this.stars = [];
      return;
    }
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.stars = Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(this.averageRating)) return 1;
      if (i < this.averageRating) return 0.5;
      return 0;
    });
  }

  getUserName(userId: string): string {
    const user = this.users.find(user => user.id == userId);
    return user ? user.fullName : 'Unknown User';
  }

  loadReviews(): void {
    this._ser.getAllReviews().subscribe(data => {
      this.reviews = data.filter(review => review.productId === this.productId);
      this.totalReviews = this.reviews.length;
      this.calculateAverageRating();
      this.loadUsers(this.reviews);
    });
  }

  loadUsers(reviews: Review[]): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users.filter(user =>
        reviews.some(review => review.userId === user.id)
      );
    });
  }

  setRating(rating: number): void {
    this.currentRating = rating;
  }

  resetForm(): void {
    this.newReview.comment = '';
    this.currentRating = 0;
    this.starsFilled = [false, false, false, false, false];
    this.isEditing = false;
    this.editingReview = null;
  }

  submitReview(): void {
    this.userService.getLoggedInUsers().subscribe(data => {
      if (!data || data.length === 0) {
        alert('Please log in to submit a review!');
        return;
      }

      const loggedInUser = data[0];
      const reviewData = {
        userId: loggedInUser.id,
        name: loggedInUser.name,/////////////////////////////////////////////////////
        comment: this.newReview.comment,
        rating: this.currentRating,
        productId: this.productId,
        createdAt: new Date()
      };

      if (this.isEditing && this.editingReview) {
        this.submitEditedReview(reviewData);
      } else {
        this._ser.postToReviews(reviewData).subscribe(response => {
          Swal.fire({
            title: 'Success!',
            text: 'Your review has been submitted successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.resetForm();
          this.loadReviews();
        }, error => {
          console.error('Error submitting review:', error);
        });
      }
    });
  }
}
