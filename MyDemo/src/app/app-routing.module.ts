import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FetchProductsComponent } from './fetch-products/fetch-products.component';
import { FetchSingleItemComponent } from './fetch-single-item/fetch-single-item.component';
const routes: Routes = [
  // { path: 'fetch-products', component: FetchProductsComponent },
  // { path: 'fetch-single-item/:itemId', component: FetchSingleItemComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
