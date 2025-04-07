import { Component } from '@angular/core';
import { ShopService } from '../../../Services/shop.service';
import Swal from 'sweetalert2';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})

export class ViewProductComponent {
  productContainer: any[] = [];
  categoryContainer: any[] = [];
  searchQuery: string = ''; // For storing search query
  selectedCategory: string = ''; // For storing selected category
  recognition: any;
  isListening: boolean = false; // To show listening feedback

  constructor(private _shop: ShopService) {
    const SpeechRecognition = webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    // Handle speech result
    this.recognition.onresult = (event: any) => {
      let spokenText = event.results[0][0].transcript;
      this.searchQuery = spokenText.trim().replace(/[.,!?]$/, ''); // Clean up the result
    };

    // Handle error
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  ngOnInit() {
    this.ViewAllProducts();
    this.ViewAllCategories(); // Fetch categories when the component is initialized
  }

  // Fetch all products
  ViewAllProducts() {
    this._shop.getAllProducts().subscribe((data) => {
      this.productContainer = data;
    });
  }

  // Fetch all categories to populate the dropdown list
  ViewAllCategories() {
    this._shop.getAllCategories().subscribe((data) => {
      this.categoryContainer = data;
    });
  }

  // Get filtered products based on search query and selected category
  get filteredProducts() {
    let filtered = this.productContainer;

    if (this.searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(item => item.categoryId === this.selectedCategory);
    }

    return filtered;
  }

  // Start listening and stop after a set time (5 seconds)
  startListening() {
    this.isListening = true;
    this.recognition.start();

    // Stop the recognition after 5 seconds
    setTimeout(() => {
      this.recognition.stop();
      this.isListening = false;
    }, 5000);
  }

  // Delete product with confirmation
  DeleteProduct(id: any) {
    Swal.fire({
      title: 'Deleting...',
      text: 'Please wait while the Product is being deleted.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this._shop.deleteProducts(id).subscribe(
      () => {
        Swal.fire('Deleted!', 'The Product has been deleted.', 'success');
        this.ViewAllProducts(); // Refresh product list
      },
      (error) => {
        Swal.fire('Error', 'Failed to delete the product. Please try again.', 'error');
        console.error('Error deleting product:', error);
      }
    );
  }
}
