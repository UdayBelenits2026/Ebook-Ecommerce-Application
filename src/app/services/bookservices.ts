import { Injectable, inject } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable, map } from 'rxjs';

import {
  Book,
  BookResponse
} from '../interface/bookinterface';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  readonly baseUrl = 'https://ebook-ecommerce-backend.onrender.com';

  private readonly http = inject(HttpClient);

  // ==========================================================
  // GET BOOKS
  // ==========================================================

  getBooks(
    page: number = 1,
    limit: number = 12,
    search: string = '',
    category_id?: number | null,
    min_price?: number | null,
    max_price?: number | null,
    sort_by?: string
  ): Observable<BookResponse> {

    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    // Search
    if (search?.trim()) {
      params = params.set(
        'search',
        search.trim()
      );
    }

    // Category
    if (category_id != null) {
      params = params.set(
        'category_id',
        String(category_id)
      );
    }

    // Minimum price
    if (min_price != null) {
      params = params.set(
        'min_price',
        String(min_price)
      );
    }

    // Maximum price
    if (max_price != null) {
      params = params.set(
        'max_price',
        String(max_price)
      );
    }

    // Sorting
    if (sort_by?.trim()) {
      params = params.set(
        'sort_by',
        sort_by.trim()
      );
    }

    return this.http
      .get<any>(
        `${this.baseUrl}/books`,
        { params }
      )
      .pipe(

        map((response): BookResponse => {

          // Backend response:
          //
          // {
          //   success: true,
          //   message: "Success",
          //   data: {
          //      items: [],
          //      total: 0,
          //      page: 1,
          //      limit: 12
          //   }
          // }

          const data = response?.data ?? {};

          const rawBooks = Array.isArray(data.items)
            ? data.items
            : [];

          const books: Book[] = rawBooks.map(
            (book: any): Book => {

              return {

                id: Number(book.id),

                title:
                  book.title ?? '',

                author:
                  book.author ?? '',

                category_id:
                  book.category_id != null
                    ? Number(book.category_id)
                    : null,

                category_name:
                  book.category_name ?? null,

                publisher:
                  book.publisher ?? null,

                isbn:
                  book.isbn ?? null,

                language:
                  book.language ?? null,

                pages:
                  book.pages != null
                    ? Number(book.pages)
                    : null,

                price:
                  Number(book.price ?? 0),

                stock:
                  Number(book.stock ?? 0),

                description:
                  book.description ?? null,

                image:
                  this.normalizeImage(
                    book.image
                  ),

                rating:
                  Number(book.rating ?? 0),

                review_count:
                  Number(book.review_count ?? 0),

                in_wishlist:
                  Boolean(book.in_wishlist),

                in_cart:
                  Boolean(book.in_cart),

                created_at:
                  book.created_at ?? null,

                updated_at:
                  book.updated_at ?? null

              };

            }
          );

          return {

            items: books,

            total:
              Number(data.total ?? books.length),

            page:
              Number(data.page ?? page),

            limit:
              Number(data.limit ?? limit)

          };

        })

      );

  }

  // ==========================================================
  // NORMALIZE IMAGE URL
  // ==========================================================

  private normalizeImage(
    image: string | null | undefined
  ): string {

    if (
      !image ||
      String(image).trim() === ''
    ) {

      return 'assets/images/no-book.png';

    }

    const imagePath =
      String(image).trim();

    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')
    ) {

      return imagePath;

    }

    const normalizedPath =
      imagePath.replace(/^\/+/, '');

    return `${this.baseUrl}/${normalizedPath}`;

  }

}