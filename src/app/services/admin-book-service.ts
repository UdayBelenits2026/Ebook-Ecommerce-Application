import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book, CreateBookDto, UpdateBookDto } from '../interface/admin-books-interface';

export interface CreateBookResponse {
  success: boolean;
  message: string;
  data: Book | null;
}

@Injectable({
  providedIn: 'root',
})
export class AdminBooksService {
  private readonly API_URL = 'https://ebook-ecommerce-backend.onrender.com/books';
  private readonly http = inject(HttpClient);

  // Get all books — backend may return either an array or a paginated object { items: [], total }
  getBooks(): Observable<Book[]> {
    console.debug('[AdminBooksService] getBooks ->', this.API_URL);
    return this.http.get<any>(this.API_URL).pipe(
      map((res) => {
        if (!res) return [];
        // Handle shapes: array, { items: [] }, { data: { items: [] } }
        if (Array.isArray(res)) return res as Book[];
        if (res.items && Array.isArray(res.items)) return res.items as Book[];
        if (res.data && res.data.items && Array.isArray(res.data.items))
          return res.data.items as Book[];
        if (res.data && Array.isArray(res.data)) return res.data as Book[];
        // Last resort: if res.data exists and is object with books under another key, try to find array
        if (res.data) {
          const maybeArray = Object.values(res.data).find((v) => Array.isArray(v));
          if (Array.isArray(maybeArray)) return maybeArray as Book[];
        }
        return [] as Book[];
      }),
    );
  }

  // Create a book — always uses multipart/form-data. Returns the full backend response.
  createBook(payload: CreateBookDto, coverImage?: File): Observable<CreateBookResponse> {
    console.debug('[AdminBooksService] createBook ->', this.API_URL, payload, coverImage?.name);

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (coverImage) {
      formData.append('image', coverImage, coverImage.name);
    }
    return this.http.post<CreateBookResponse>(this.API_URL, formData);
  }

  // Update a book
  updateBook(id: number, payload: UpdateBookDto): Observable<Book> {
    console.debug('[AdminBooksService] updateBook ->', `${this.API_URL}/${id}`, payload);
    return this.http.put<Book>(`${this.API_URL}/${id}`, payload);
  }

  // Delete a book
  deleteBook(id: number): Observable<void> {
    console.debug('[AdminBooksService] deleteBook ->', `${this.API_URL}/${id}`);
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Upload a cover image for a book
  // Upload a cover image for a book. When observeEvents is true, the request reports progress events.
  uploadImage(id: number, file: File, observeEvents = false): Observable<any> {
    const form = new FormData();
    form.append('image', file, file.name);
    const url = `${this.API_URL}/${id}/upload-image`;
    console.debug('[AdminBooksService] uploadImage ->', url, file.name);
    if (observeEvents) {
      return this.http.post(url, form, { reportProgress: true, observe: 'events' as any });
    }
    return this.http.post(url, form);
  }
}
