import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category, CreateCategoryDto } from '../interface/category-interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly apiRoot = 'http://127.0.0.1:8000';
  private readonly baseUrl = `${this.apiRoot}/categories`;
  private readonly http = inject(HttpClient);

  /** GET /categories → Fetch all categories wrapped in { data, ... } */
  getCategories(): Observable<Category[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((response) => {
        const items = response?.data;
        if (!Array.isArray(items)) return [];
        return items.map((cat: any) => ({
          ...cat,
          image: (cat.image && String(cat.image).trim() !== '')
            ? String(cat.image).startsWith('http')
              ? String(cat.image)
              : `${this.apiRoot}/${String(cat.image)}`
            : undefined,
        }));
      })
    );
  }

  /** POST /categories → Create a new category (name, description, optional image) */
  createCategory(data: CreateCategoryDto, image?: File): Observable<{ success: boolean; message: string; data: Category | null }> {
    if (image) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('image', image, image.name);
      return this.http.post<{ success: boolean; message: string; data: Category | null }>(this.baseUrl, formData);
    }
    return this.http.post<{ success: boolean; message: string; data: Category | null }>(this.baseUrl, {
      name: data.name,
      description: data.description,
    });
  }

  /** DELETE /categories/{id} → Delete a category by ID */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

