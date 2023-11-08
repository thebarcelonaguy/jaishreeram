import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EbayapiService {

  private apiUrl = 'https://rahul-aggarwal.wl.r.appspot.com/'; // Replace with environment variable if needed

  constructor(private http: HttpClient) { }

  searchEbay(formValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/search`, formValue);
  }
  getItemDetails(itemId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/item-details/${itemId}`);
  }
  getSimilarItems(itemId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getSimilarItems/${itemId}`);
  }




}
