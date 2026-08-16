import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse, Address, AddressRequest } from '../interface/address-interface';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://ebook-ecommerce-backend.onrender.com/addresses';

  // GET ALL ADDRESSES

  getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(this.apiUrl);
  }

  // GET ADDRESS BY ID

  getAddress(id: number): Observable<ApiResponse<Address>> {
    return this.http.get<ApiResponse<Address>>(`${this.apiUrl}/${id}`);
  }

  // ADD ADDRESS

  addAddress(address: AddressRequest): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(this.apiUrl, address);
  }

  // UPDATE ADDRESS

  updateAddress(id: number, address: AddressRequest): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.apiUrl}/${id}`, address);
  }

  // DELETE ADDRESS

  deleteAddress(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
