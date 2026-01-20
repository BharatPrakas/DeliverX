import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpRoutingService {

  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  get(url: string, params?: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + url, { params: params });
  }

  post(url: string, data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + url, data);
  }
}
