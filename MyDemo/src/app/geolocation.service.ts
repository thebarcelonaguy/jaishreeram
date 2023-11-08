// geolocation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private apiUrl: string = 'https://ipinfo.io/json?token=440157954aa416';

  constructor(private http: HttpClient) { }

  getCurrentLocation() {
    return this.http.get(this.apiUrl);
  }
}
