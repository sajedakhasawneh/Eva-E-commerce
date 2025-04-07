
import { Component } from '@angular/core';
import { ShopService } from '../../../Services/shop.service';
import Swal from 'sweetalert2';

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css'
})
export class ViewCategoryComponent {
  categoryContainer: any[] = [];
  categoryLength: number = 0;
  searchQuery: string = '';

  recognition: any;

  constructor(private _shop: ShopService) {
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
    this.ViewAllCategories();
  }

  get filteredCategories() {
    if (!this.searchQuery) return this.categoryContainer;
    return this.categoryContainer.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  isListening: boolean = false;

  startListening() {
    this.isListening = true;
    this.recognition.start();

    setTimeout(() => {
      this.recognition.stop();
      this.isListening = false;
    }, 5000);
  }

  ViewAllCategories() {
    this._shop.getAllCategories().subscribe((data) => {
      this.categoryContainer = data;
      this.categoryLength = this.categoryContainer.length;
    });
  }

  DeleteCategory(id: number) {
    Swal.fire({
      title: 'Checking Category...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this._shop.getCategoryByCategoryId(id).subscribe(
      (categoryC) => {
        Swal.close();

        if (this.categoryContainer.length > 0) {
          Swal.fire({
            title: 'This category contains products!',
            text: 'Are you sure you want to delete it?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff6f91',
            cancelButtonColor: '#ff4c6a',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.confirmDelete(id);
            }
          });
        } else {
          this.confirmDelete(id);
        }
      },
      (error) => {
        Swal.close();
        Swal.fire('Error', 'Failed to fetch category details. Please try again.', 'error');
        console.error('Error fetching category:', error);
      }
    );
  }

  confirmDelete(categoryId: number) {
    this._shop.deleteCategory(categoryId).subscribe(() => {
      Swal.fire("Deleted!", "Category has been deleted.", "success");
      this.ViewAllCategories();
    }, error => {
      Swal.fire("Error!", "Failed to delete the category.", "error");
    });
  }
}
