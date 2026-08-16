import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResponse, ContactMessage } from '../interface/admin-enquiry-interface';

@Injectable({
  providedIn: 'root',
})
export class AdminEnquiryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://127.0.0.1:8000/admin';

  // GET CONTACT MESSAGES

  getMessages(): Observable<ApiResponse<ContactMessage[]>> {
    return this.http.get<ApiResponse<ContactMessage[]>>(`${this.apiUrl}/contact-messages`);
  }

  // MARK MESSAGE AS READ

  markAsRead(id: number): Observable<ApiResponse<ContactMessage>> {
    return this.http.patch<ApiResponse<ContactMessage>>(
      `${this.apiUrl}/contact-messages/${id}/read`,
      {},
    );
  }

  // DELETE MESSAGE

  deleteMessage(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/contact-messages/${id}`);
  }
}
