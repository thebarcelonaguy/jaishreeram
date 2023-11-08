
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, filter } from 'rxjs/operators';
import { GeolocationService } from '../geolocation.service';
import { EbayapiService } from '../services/ebayapi.service';
import { NgForm } from '@angular/forms';
import { ImageSearchService } from '../services/image-search.service';


// Define the SearchQuery interface
interface SearchQuery {
  keyword: string;
  category: string;
  condition: string[];
  shipping: string[];
  distance: number;
  locationChoice: 'currentLocation' | 'zipCode';
  zipCode?: string;
}

@Component({
  selector: 'app-fetch-products',
  templateUrl: './fetch-products.component.html',
  styleUrls: ['./fetch-products.component.css']
})
export class FetchProductsComponent implements OnInit {

  zipCodeControl = new FormControl();
  filteredZipCodes!: Observable<string[]>;
  locationChoice: string = '';
  zipCode: string = '';
  products: any[] = []; // Store the product results
  title = 'Product Search App'
  sellerDetails: any;;
  showResults = false;
  selectedTab: string = 'info';
  selectedItem: any = null;// Make sure this line is present in your component clas
  @ViewChild('searchForm') searchForm!: NgForm;


  constructor(
    private router: Router,
    private geoService: GeolocationService,
    private ebayapiService: EbayapiService,
    private imageSearchService: ImageSearchService

  ) { }


  ngOnInit() {
    this.filteredZipCodes = this.zipCodeControl.valueChanges.pipe(
      debounceTime(300),
      filter(value => typeof value === 'string' && value.length >= 3),
      switchMap(value => this.getZipCodeSuggestions(value))
    );

  }


  getZipCodeSuggestions(value: string): Observable<string[]> {
    // Here you would call your geolocation service or any other service required
    return of([]); // Stubbed for example purposes
  }

  onSubmit(formValue: SearchQuery) {
    this.ebayapiService.searchEbay(formValue).subscribe({
      next: (response: any) => {
        if (response.findItemsAdvancedResponse && response.findItemsAdvancedResponse[0].searchResult && response.findItemsAdvancedResponse[0].searchResult[0].item) {
          // Map the API response to the products array format expected by your component
          this.products = response.findItemsAdvancedResponse[0].searchResult[0].item.map((item: any) => {
            return {
              itemId: item.itemId[0],
              title: item.title ? item.title[0] : 'N/A', // Assuming title is an array
              price: item.sellingStatus && item.sellingStatus[0].currentPrice
                ? item.sellingStatus[0].currentPrice[0].__value__
                : 'N/A', // Assuming a nested structure for price
              condition: item.condition && item.condition[0].conditionDisplayName
                ? item.condition[0].conditionDisplayName[0]
                : 'N/A', // Assuming a nested structure for condition
              imageUrl: item.galleryURL ? item.galleryURL[0] : 'N/A', // Assuming galleryURL is an array
              // Add other fields as necessary

            };
          });
        } else {
          // Handle the case where the expected data structure is not present
          this.products = [];
          console.error('Unexpected API response structure:', response);
        }
        console.log('Mapped products:', this.products);
      },
      error: (error) => {
        console.error('Error during search:', error);
      }
    });
  }



  onLocationChange() {
    if (this.locationChoice === 'currentLocation') {
      this.geoService.getCurrentLocation().subscribe({
        next: (data) => {
          console.log('Current location data:', data);
          // Update the component state with the geolocation data
        },
        error: (error) => {
          console.error('Error fetching location:', error);
        }
      });
    }
  }
  toggleWishlist(product: any) {
    product.wishlist = !product.wishlist;
    // Handle the wishlist state change as needed, e.g., save to a service or local storage
  }

  goToFetchProducts() {
    this.router.navigate(['/fetch-products']);
  }
  searchImagesForItem(itemTitle: string) {
    this.imageSearchService.searchImages(itemTitle).subscribe({
      next: (response) => {
        // Handle the response with your images
        console.log('Image search results for', itemTitle, ':', response);
      },
      error: (error) => {
        console.error('Error during image search for', itemTitle, ':', error);
      }
    });
  }
  selectProduct(itemId: string) {
    this.ebayapiService.getItemDetails(itemId).subscribe({
      next: (response) => {
        console.log('Product details response:', response);
        this.selectedItem = response.Item;
        this.sellerDetails = response.Item.Seller;

        if (response.Item.Storefront) {
          this.sellerDetails.storeName = response.Item.Storefront.StoreName;
          this.sellerDetails.storeURL = response.Item.Storefront.StoreURL;
        }

        console.log('Selected item details:', this.selectedItem);
        console.log('Seller details:', this.sellerDetails);
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
      }
    });
  }
  showSellerInfo(): void {
    this.selectedTab = 'seller';
    console.log('Selected tab:', this.selectedTab);
  }
  showInfo() {
    this.selectedTab = 'info';
  }

}

