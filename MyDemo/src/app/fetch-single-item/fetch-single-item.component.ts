import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EbayapiService } from '../services/ebayapi.service';
import { ImageSearchService } from '../services/image-search.service'; // Import your image search service


@Component({
  selector: 'app-fetch-single-item',
  templateUrl: './fetch-single-item.component.html',
  styleUrls: ['./fetch-single-item.component.css']
})
export class FetchSingleItemComponent implements OnInit {
  itemId!: string; // Using the non-null assertion operator
  itemDetails: any;
  sellerDetails: any;
  images: any[] = [];
  similarItems: any[] = [];
  // Add a property to hold the images

  constructor(
    private route: ActivatedRoute,
    private ebayapiService: EbayapiService,
    private imageSearchService: ImageSearchService // Inject your image search service
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route parameters:', params);
      this.itemId = params['itemId']; // Grab the item ID from the route parameters
      console.log('Item ID:', this.itemId);
      this.fetchItemDetails();
      this.fetchSimilarItems();
    });
  }


  fetchItemDetails() {
    this.ebayapiService.getItemDetails(this.itemId).subscribe({
      next: (response) => {
        console.log('Item details response:', response);
        this.itemDetails = response.Item;
        this.sellerDetails = response.Item.Seller;

        if (response.Item.Storefront) {
          this.sellerDetails.storeName = response.Item.Storefront.StoreName;
          this.sellerDetails.storeURL = response.Item.Storefront.StoreURL;
        }

        console.log('Item details:', this.itemDetails);
        console.log('Seller details:', this.sellerDetails);
        // Only call loadImages if itemDetails and its Title are defined
        if (this.itemDetails && this.itemDetails.Title) {
          console.log('Loading images for:', this.itemDetails.Title);
          this.loadImages(this.itemDetails.Title);
        }
      },
      error: (error) => {
        console.error('Error fetching item details:', error);
      }
    });
  }

  loadImages(query: string) {
    this.imageSearchService.searchImages(query).subscribe(
      data => {
        this.images = data.items;
        console.log('Images:', this.images);
        if (!this.images) {
          console.error('No images found:', data);
          // Handle no images found, show user feedback
        }
      },
      error => {
        console.error('Error fetching images:', error);
        // Handle error, show user feedback
      }
    );
  }
  fetchSimilarItems() {
    this.ebayapiService.getSimilarItems(this.itemId).subscribe({
      next: (response) => {
        this.similarItems = response.getSimilarItemsResponse.itemRecommendations.item;

        console.log('Similar items:', this.similarItems);
      },
      error: (error) => {
        console.error('Error fetching similar items:', error);
      }
    });
  }
  extractDays(timeLeft: string): number | string {
    const match = timeLeft.match(/P(\d+)D/);
    return match ? match[1] : 'N/A'; // Return 'N/A' if the pattern doesn't match
  }




}
