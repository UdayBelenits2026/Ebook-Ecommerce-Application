import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { HttpEventType } from '@angular/common/http';

import { finalize } from 'rxjs/operators';

import { AdminBooksService, CreateBookResponse } from '../../services/admin-book-service';

import { CategoriesService } from '../../services/categories-service';

import { Category } from '../../interface/category-interface';

import { Book, CreateBookDto, UpdateBookDto } from '../../interface/admin-books-interface';

type BookSection = 'create' | 'view' | 'update' | 'delete';

/* 
   CUSTOM VALIDATORS
 */

function priceGreaterThanZero(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value === null || value === undefined || value === '') {
    return { required: true };
  }

  return Number(value) > 0
    ? null
    : {
        min: {
          min: 0.01,
          actual: value,
        },
      };
}

function stockNonNegative(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value === null || value === undefined || value === '') {
    return { required: true };
  }

  return Number(value) >= 0
    ? null
    : {
        min: {
          min: 0,
          actual: value,
        },
      };
}

@Component({
  selector: 'app-admin-books',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './books.html',
  styleUrls: ['./books.css'],
})
export class AdminBooksComponent implements OnInit {
  /* 
     SERVICES
   */

  private readonly bookService = inject(AdminBooksService);

  private readonly categoriesService = inject(CategoriesService);

  private readonly fb = inject(FormBuilder);

  private readonly cdr = inject(ChangeDetectorRef);

  /* 
     DATA
   */

  books: Book[] = [];

  categories: Category[] = [];

  /* 
     BOOK COUNTS
   */

  totalBooks = 0;

  /* 
     STATE
   */

  loading = false;

  submitting = false;

  categoriesLoading = false;

  uploading = false;

  uploadProgress = 0;

  deletingBookId: number | null = null;

  selectedBookId: number | null = null;

  isEditMode = false;

  /* 
     MESSAGES
   */

  feedbackMessage = '';

  errorMessage = '';

  validationErrors: Record<string, string> = {};

  /* 
     IMAGE
   */

  fileToUpload: File | null = null;

  defaultCoverImage = 'assets/images/no-book.png';

  private readonly apiRoot = 'https://ebook-ecommerce-backend.onrender.com';

  /* 
     ACTIVE TAB
   */

  activeTab = signal<BookSection>('view');

  sectionTabs = [
    {
      value: 'create' as BookSection,
      label: 'Create Book',
      icon: 'bi bi-plus-square',
    },

    {
      value: 'view' as BookSection,
      label: 'View Books',
      icon: 'bi bi-card-list',
    },

    {
      value: 'update' as BookSection,
      label: 'Update Book',
      icon: 'bi bi-pencil-square',
    },

    {
      value: 'delete' as BookSection,
      label: 'Delete Book',
      icon: 'bi bi-trash',
    },
  ];

  /* 
     FORM
   */

  bookForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],

    author: ['', [Validators.required, Validators.maxLength(255)]],

    category_id: [0, [Validators.required, Validators.min(1)]],

    publisher: ['', [Validators.required, Validators.maxLength(255)]],

    isbn: ['', [Validators.required, Validators.maxLength(20)]],

    language: ['', [Validators.required, Validators.maxLength(100)]],

    pages: [1, [Validators.required, Validators.min(1)]],

    price: [1, [Validators.required, priceGreaterThanZero]],

    stock: [0, [Validators.required, stockNonNegative]],

    description: ['', Validators.required],
  });

  /* 
     INITIALIZATION
   */

  ngOnInit(): void {
    console.log('[AdminBooks] Component initialized');

    this.loadCategories();

    /*
     * Automatically load books when admin
     * opens this page.
     */

    this.loadBooks();
  }

  /* 
     SELECT TAB
   */

  selectTab(tab: BookSection): void {
    this.activeTab.set(tab);

    this.feedbackMessage = '';

    this.errorMessage = '';

    this.validationErrors = {};

    if (tab === 'create') {
      this.resetForm();

      return;
    }

    if (tab === 'update') {
      this.isEditMode = false;

      this.selectedBookId = null;

      this.resetForm();
    }

    /*
     * Always refresh books when entering:
     *
     * View
     * Update
     * Delete
     */

    if (tab === 'view' || tab === 'update' || tab === 'delete') {
      this.loadBooks();
    }
  }

  /* 
     LOAD CATEGORIES
   */

  loadCategories(): void {
    this.categoriesLoading = true;

    this.categoriesService
      .getCategories()
      .pipe(
        finalize(() => {
          this.categoriesLoading = false;

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          console.log('[AdminBooks] Categories:', data);

          this.categories = Array.isArray(data) ? data : [];

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('[AdminBooks] Category error:', err);

          this.categories = [];

          this.cdr.detectChanges();
        },
      });
  }

  /* 
     LOAD BOOKS
   */

  loadBooks(): void {
    /*
     * Prevent duplicate calls while
     * current request is running.
     */

    if (this.loading) {
      console.log('[AdminBooks] loadBooks already running');

      return;
    }

    console.log('[AdminBooks] Loading books...');

    this.loading = true;

    this.errorMessage = '';

    this.bookService.getBooks().subscribe({
      next: (response: any) => {
        console.log('[AdminBooks] RAW RESPONSE:', response);

        /*
         * =================================================
         * SUPPORT ALL COMMON BACKEND RESPONSE FORMATS
         * =================================================
         *
         * 1. [...]
         *
         * 2. { items: [...] }
         *
         * 3. { data: [...] }
         *
         * 4. {
         *      success: true,
         *      data: {
         *        items: [...]
         *      }
         *    }
         */

        let bookItems: Book[] = [];

        let total = 0;

        // -----------------------------------------------
        // RESPONSE IS DIRECT ARRAY
        // -----------------------------------------------

        if (Array.isArray(response)) {
          bookItems = response;

          total = response.length;
        }

        // -----------------------------------------------
        // RESPONSE.ITEMS
        // -----------------------------------------------
        else if (Array.isArray(response?.items)) {
          bookItems = response.items;

          total = Number(response.total ?? response.items.length);
        }

        // -----------------------------------------------
        // RESPONSE.DATA ARRAY
        // -----------------------------------------------
        else if (Array.isArray(response?.data)) {
          bookItems = response.data;

          total = Number(response.total ?? response.data.length);
        }

        // -----------------------------------------------
        // RESPONSE.DATA.ITEMS
        // -----------------------------------------------
        else if (Array.isArray(response?.data?.items)) {
          bookItems = response.data.items;

          total = Number(response.data.total ?? response.total ?? response.data.items.length);
        }

        // -----------------------------------------------
        // UNKNOWN RESPONSE
        // -----------------------------------------------
        else {
          console.warn('[AdminBooks] Unknown books response:', response);

          bookItems = [];

          total = 0;
        }

        console.log('[AdminBooks] Extracted books:', bookItems);

        /*
         * =================================================
         * NORMALISE BOOKS
         * =================================================
         */

        this.books = bookItems.map((book: any) => {
          return {
            ...book,

            image: this.getBookImage(book),
          } as Book;
        });

        this.totalBooks = total || this.books.length;

        /*
         * Explicitly finish loading here.
         */

        this.loading = false;

        console.log('[AdminBooks] books.length:', this.books.length);

        console.log('[AdminBooks] totalBooks:', this.totalBooks);

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('[AdminBooks] Books API error:', err);

        this.books = [];

        this.totalBooks = 0;

        this.loading = false;

        this.errorMessage = this.extractError(err, 'Unable to fetch books');

        this.cdr.detectChanges();
      },
    });
  }

  /* 
     GET BOOK IMAGE
   */

  getBookImage(book: any): string {
    const rawImage = book?.image_url || book?.image || book?.cover_image || book?.image_path;

    if (!rawImage || String(rawImage).trim() === '') {
      return this.defaultCoverImage;
    }

    const image = String(rawImage).trim();

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    if (image.startsWith('/')) {
      return `${this.apiRoot}${image}`;
    }

    return `${this.apiRoot}/${image}`;
  }

  /* 
     IMAGE ERROR
   */

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    img.onerror = null;

    img.src = this.defaultCoverImage;
  }

  /* 
     SELECT FILE
   */

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.fileToUpload = input.files?.[0] ?? null;
  }

  /* 
     CREATE BOOK
   */

  createBook(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();

      return;
    }

    this.submitting = true;

    this.errorMessage = '';

    this.feedbackMessage = '';

    this.validationErrors = {};

    const value = this.bookForm.getRawValue();

    const payload: CreateBookDto = {
      title: value.title,

      author: value.author,

      category_id: Number(value.category_id),

      publisher: value.publisher,

      isbn: value.isbn,

      language: value.language,

      pages: Number(value.pages),

      price: Number(value.price),

      stock: Number(value.stock),

      description: value.description,
    };

    this.bookService.createBook(payload, this.fileToUpload ?? undefined).subscribe({
      next: (response: CreateBookResponse) => {
        this.submitting = false;

        if (!response?.success) {
          this.errorMessage = response?.message || 'Failed to create book';

          this.cdr.detectChanges();

          return;
        }

        this.feedbackMessage = response.message || 'Book created successfully';

        this.resetForm();

        /*
         * Reload books from server.
         */

        this.loadBooks();

        this.cdr.detectChanges();
      },

      error: (err) => {
        this.submitting = false;

        this.handleBackendError(err);

        this.cdr.detectChanges();
      },
    });
  }

  /* 
     SELECT BOOK FOR UPDATE
   */

  selectBookForUpdate(bookId: number | string): void {
    const id = Number(bookId);

    if (!id) {
      this.isEditMode = false;

      this.selectedBookId = null;

      return;
    }

    const book = this.books.find((item) => Number(item.id) === id);

    if (!book) {
      this.errorMessage = 'Selected book could not be found.';

      return;
    }

    this.isEditMode = true;

    this.selectedBookId = book.id;

    this.bookForm.patchValue({
      title: book.title ?? '',

      author: book.author ?? '',

      category_id: Number(book.category_id ?? 0),

      publisher: book.publisher ?? '',

      isbn: book.isbn ?? '',

      language: book.language ?? '',

      pages: Number(book.pages ?? 1),

      price: Number(book.price ?? 1),

      stock: Number(book.stock ?? 0),

      description: book.description ?? '',
    });

    this.cdr.detectChanges();
  }

  /* 
     UPDATE BOOK
   */

  updateBook(): void {
    if (!this.isEditMode || this.selectedBookId === null) {
      this.errorMessage = 'Select a book to update';

      return;
    }

    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();

      return;
    }

    this.submitting = true;

    this.errorMessage = '';

    this.feedbackMessage = '';

    const value = this.bookForm.getRawValue();

    const payload: UpdateBookDto = {
      title: value.title,

      author: value.author,

      category_id: Number(value.category_id),

      publisher: value.publisher,

      isbn: value.isbn,

      language: value.language,

      pages: Number(value.pages),

      price: Number(value.price),

      stock: Number(value.stock),

      description: value.description,
    };

    this.bookService.updateBook(this.selectedBookId, payload).subscribe({
      next: () => {
        this.submitting = false;

        this.feedbackMessage = 'Book updated successfully';

        this.resetForm();

        this.activeTab.set('view');

        this.loadBooks();

        this.cdr.detectChanges();
      },

      error: (err) => {
        this.submitting = false;

        this.errorMessage = this.extractError(err, 'Unable to update book');

        this.cdr.detectChanges();
      },
    });
  }

  /* 
     DELETE BOOK
   */

  deleteBook(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this book?');

    if (!confirmed) {
      return;
    }

    this.deletingBookId = id;

    this.errorMessage = '';

    this.feedbackMessage = '';

    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.deletingBookId = null;

        this.books = this.books.filter((book) => book.id !== id);

        this.totalBooks = Math.max(0, this.totalBooks - 1);

        if (this.selectedBookId === id) {
          this.resetForm();
        }

        this.feedbackMessage = 'Book deleted successfully';

        this.cdr.detectChanges();
      },

      error: (err) => {
        this.deletingBookId = null;

        this.errorMessage = this.extractError(err, 'Unable to delete book');

        this.cdr.detectChanges();
      },
    });
  }

  /* 
     UPLOAD COVER
   */

  uploadCover(): void {
    if (!this.fileToUpload || !this.selectedBookId) {
      this.errorMessage = 'Select a book and an image first';

      return;
    }

    this.uploading = true;

    this.uploadProgress = 0;

    this.bookService.uploadImage(this.selectedBookId, this.fileToUpload, true).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        }

        if (event.type === HttpEventType.Response) {
          this.uploading = false;

          this.uploadProgress = 100;

          this.feedbackMessage = 'Image uploaded successfully';

          /*
           * Reload server data so we get
           * latest image path.
           */

          this.loadBooks();
        }

        this.cdr.detectChanges();
      },

      error: (err) => {
        this.uploading = false;

        this.uploadProgress = 0;

        this.errorMessage = this.extractError(err, 'Image upload failed');

        this.cdr.detectChanges();
      },
    });
  }

  /* 
     SAVE
   */

  save(): void {
    if (this.activeTab() === 'update') {
      this.updateBook();

      return;
    }

    this.createBook();
  }

  /* 
     RESET FORM
   */

  resetForm(): void {
    this.bookForm.reset({
      title: '',

      author: '',

      category_id: 0,

      publisher: '',

      isbn: '',

      language: '',

      pages: 1,

      price: 1,

      stock: 0,

      description: '',
    });

    this.isEditMode = false;

    this.selectedBookId = null;

    this.submitting = false;

    this.fileToUpload = null;

    this.uploading = false;

    this.uploadProgress = 0;

    this.validationErrors = {};
  }

  /* 
     FIELD LABEL
   */

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      title: 'Title',

      author: 'Author',

      category_id: 'Category',

      publisher: 'Publisher',

      isbn: 'ISBN',

      language: 'Language',

      pages: 'Pages',

      price: 'Price',

      stock: 'Stock',

      description: 'Description',
    };

    return labels[field] || field;
  }

  /* 
     FIELD INVALID
   */

  isFieldInvalid(field: string): boolean {
    const control = this.bookForm.get(field);

    return !!(control && control.touched && control.invalid);
  }

  /* 
     FIELD ERROR
   */

  getFieldError(field: string): string {
    const control = this.bookForm.get(field);

    if (!control || !control.touched || !control.invalid) {
      return '';
    }

    if (this.validationErrors[field]) {
      return this.validationErrors[field];
    }

    if (control.errors?.['required']) {
      return `${this.getFieldLabel(field)} is required`;
    }

    if (control.errors?.['maxlength']) {
      return `${this.getFieldLabel(field)} must not exceed ${
        control.errors['maxlength'].requiredLength
      } characters`;
    }

    if (control.errors?.['min']) {
      return `${this.getFieldLabel(field)} must be ${control.errors['min'].min} or more`;
    }

    if (control.errors?.['backend']) {
      return control.errors['backend'];
    }

    return '';
  }

  /* 
     BACKEND ERROR
   */

  private handleBackendError(err: any): void {
    this.validationErrors = {};

    this.submitting = false;

    const body = err?.error;

    if (body?.data && typeof body.data === 'object' && !Array.isArray(body.data)) {
      this.errorMessage = body.message || 'Validation failed';

      Object.keys(body.data).forEach((field) => {
        const message = body.data[field];

        if (!message) {
          return;
        }

        this.validationErrors[field] = message;

        const control = this.bookForm.get(field);

        if (control) {
          control.setErrors({
            backend: message,
          });
        }
      });

      return;
    }

    this.errorMessage = this.extractError(err, 'Unable to create book');
  }

  /* 
     ERROR
   */

  private extractError(err: any, fallback: string = 'Something went wrong'): string {
    if (!err) {
      return fallback;
    }

    if (err.status === 401) {
      return 'Unauthorized. Please login again.';
    }

    if (err.status === 403) {
      return 'You are not authorised to perform this action.';
    }

    if (err.status === 404) {
      return 'Requested resource was not found.';
    }

    if (err.status === 0) {
      return 'Unable to connect to the backend server.';
    }

    return err.error?.message || err.error?.detail || fallback;
  }
}
