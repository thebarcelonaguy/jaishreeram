import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageSearchService {

  private SERVER_URL = '/http://localhost:3000/getImages'; // This will be your Express server's route for image search

  constructor(private http: HttpClient) { }

  public searchImages(query: string): Observable<any> {
    return this.http.get(`${this.SERVER_URL}`, { params: { query } });
  }
}
