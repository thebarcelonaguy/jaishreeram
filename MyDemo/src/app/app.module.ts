import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FetchProductsComponent } from './fetch-products/fetch-products.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EbayapiService } from './services/ebayapi.service';
import { FetchSingleItemComponent } from './fetch-single-item/fetch-single-item.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    FetchProductsComponent,
    FetchSingleItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTabsModule,

  ],
  providers: [EbayapiService],
  bootstrap: [AppComponent]
})
export class AppModule { }