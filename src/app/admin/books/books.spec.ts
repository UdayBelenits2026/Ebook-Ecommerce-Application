import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpEventType } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { AdminBooksComponent } from './books';

import { AdminBooksService } from '../../services/admin-book-service';

import { CategoriesService } from '../../services/categories-service';

describe('AdminBooksComponent', () => {
  let component: AdminBooksComponent;

  let fixture: ComponentFixture<AdminBooksComponent>;

  let bookSpy: jasmine.SpyObj<AdminBooksService>;

  let catSpy: jasmine.SpyObj<CategoriesService>;

  // ============================================================
  // SETUP
  // ============================================================

  beforeEach(async () => {
    bookSpy = jasmine.createSpyObj('AdminBooksService', [
      'getBooks',
      'createBook',
      'updateBook',
      'deleteBook',
      'uploadImage',
    ]);

    catSpy = jasmine.createSpyObj('CategoriesService', ['getCategories']);

    /*
     * Default responses.
     *
     * These are required because detectChanges()
     * triggers ngOnInit().
     */

    bookSpy.getBooks.and.returnValue(of([] as any));

    catSpy.getCategories.and.returnValue(of([] as any));

    bookSpy.createBook.and.returnValue(
      of({
        success: true,
        message: 'Book created successfully',
      } as any),
    );

    bookSpy.updateBook.and.returnValue(
      of({
        success: true,
        message: 'Book updated successfully',
      } as any),
    );

    bookSpy.deleteBook.and.returnValue(
      of({
        success: true,
        message: 'Book deleted successfully',
      } as any),
    );

    bookSpy.uploadImage.and.returnValue(
      of({
        type: HttpEventType.Response,

        body: {
          success: true,
          message: 'Image uploaded',
        },
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [AdminBooksComponent],

      providers: [
        {
          provide: AdminBooksService,
          useValue: bookSpy,
        },

        {
          provide: CategoriesService,
          useValue: catSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBooksComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // COMPONENT CREATION
  // ============================================================

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  // GET BOOK IMAGE
  // ============================================================

  it('getBookImage returns default for empty image', () => {
    const result = component.getBookImage({});

    expect(result).toContain('no-book.png');
  });

  it('getBookImage returns full URL when image is already a URL', () => {
    const result = component.getBookImage({
      image: 'http://img.com/x.jpg',
    });

    expect(result).toBe('http://img.com/x.jpg');
  });

  it('getBookImage handles image path beginning with slash', () => {
    const result = component.getBookImage({
      image: '/path.jpg',
    });

    expect(result).toContain('/path.jpg');
  });

  it('getBookImage handles relative image path', () => {
    const result = component.getBookImage({
      image: 'path.jpg',
    });

    expect(result).toContain('/path.jpg');
  });

  // ============================================================
  // IMAGE ERROR
  // ============================================================

  it('onImageError replaces src with default image', () => {
    const img = document.createElement('img');

    const event = {
      target: img,
    } as any;

    component.onImageError(event);

    expect(img.src).toContain(component.defaultCoverImage);
  });

  // ============================================================
  // FILE SELECTION
  // ============================================================

  it('onFileSelect sets fileToUpload', () => {
    const file = new File(['x'], 'a.png', {
      type: 'image/png',
    });

    const event = {
      target: {
        files: [file],
      },
    } as any;

    component.onFileSelect(event);

    expect(component.fileToUpload).toBe(file);
  });

  it('onFileSelect does nothing when no file is selected', () => {
    component.fileToUpload = null;

    const event = {
      target: {
        files: [],
      },
    } as any;

    component.onFileSelect(event);

    expect(component.fileToUpload).toBeNull();
  });

  // ============================================================
  // RESET FORM
  // ============================================================

  it('resetForm resets form and states', () => {
    component.isEditMode = true;

    component.selectedBookId = 5;

    component.fileToUpload = new File(['x'], 'a.png');

    component.resetForm();

    expect(component.isEditMode).toBeFalse();

    expect(component.selectedBookId).toBeNull();

    expect(component.fileToUpload).toBeNull();

    expect(component.uploadProgress).toBe(0);

    expect(component.uploading).toBeFalse();
  });

  // ============================================================
  // SELECT TAB
  // ============================================================

  it('selectTab create resets form and does not call loadBooks', () => {
    spyOn(component, 'loadBooks');

    component.selectTab('create');

    expect(component.loadBooks).not.toHaveBeenCalled();

    expect(component.activeTab()).toBe('create');
  });

  it('selectTab view calls loadBooks', () => {
    spyOn(component, 'loadBooks');

    component.selectTab('view');

    expect(component.activeTab()).toBe('view');

    expect(component.loadBooks).toHaveBeenCalled();
  });

  it('selectTab update resets edit state and loads books', () => {
    component.isEditMode = true;

    component.selectedBookId = 10;

    spyOn(component, 'loadBooks');

    component.selectTab('update');

    expect(component.activeTab()).toBe('update');

    expect(component.isEditMode).toBeFalse();

    expect(component.selectedBookId).toBeNull();

    expect(component.loadBooks).toHaveBeenCalled();
  });

  it('selectTab delete loads books', () => {
    spyOn(component, 'loadBooks');

    component.selectTab('delete');

    expect(component.activeTab()).toBe('delete');

    expect(component.loadBooks).toHaveBeenCalled();
  });

  // ============================================================
  // CREATE BOOK
  // ============================================================

  it('createBook handles success response', () => {
    component.bookForm.patchValue({
      title: 't',

      author: 'a',

      category_id: 1,

      publisher: 'p',

      isbn: 'i',

      language: 'en',

      pages: 10,

      price: 10,

      stock: 1,

      description: 'd',
    });

    spyOn(component, 'loadBooks');

    bookSpy.createBook.and.returnValue(
      of({
        success: true,

        message: 'ok',
      } as any),
    );

    component.createBook();

    expect(component.feedbackMessage).toContain('ok');

    expect(component.loadBooks).toHaveBeenCalled();
  });

  // ============================================================
  // CREATE BOOK - VALIDATION ERROR
  // ============================================================

  it('createBook handles validation error response', () => {
    component.bookForm.patchValue({
      title: 't',

      author: 'a',

      category_id: 1,

      publisher: 'p',

      isbn: 'i',

      language: 'en',

      pages: 10,

      price: 10,

      stock: 1,

      description: 'd',
    });

    const error = {
      error: {
        data: {
          title: 'Too long',
        },

        message: 'Validation failed',
      },
    };

    bookSpy.createBook.and.returnValue(throwError(() => error));

    component.createBook();

    expect(component.validationErrors['title']).toBe('Too long');

    expect(component.bookForm.get('title')?.errors?.['backend']).toBeTruthy();
  });

  // ============================================================
  // CREATE BOOK - INVALID FORM
  // ============================================================

  it('createBook should not call service when form is invalid', () => {
    component.bookForm.reset();

    component.createBook();

    expect(bookSpy.createBook).not.toHaveBeenCalled();
  });

  // ============================================================
  // LOAD BOOKS
  // ============================================================

  it('loadBooks handles direct array response', () => {
    const books = [
      {
        id: 1,
        title: 'Book One',
      },

      {
        id: 2,
        title: 'Book Two',
      },
    ];

    bookSpy.getBooks.and.returnValue(of(books as any));

    component.loading = false;

    component.loadBooks();

    expect(component.books.length).toBe(2);

    expect(component.totalBooks).toBe(2);

    expect(component.loading).toBeFalse();
  });

  it('loadBooks handles items response', () => {
    const response = {
      items: [
        {
          id: 1,
          title: 'Angular',
        },
      ],

      total: 1,
    };

    bookSpy.getBooks.and.returnValue(of(response as any));

    component.loading = false;

    component.loadBooks();

    expect(component.books.length).toBe(1);

    expect(component.totalBooks).toBe(1);

    expect(component.books[0].id).toBe(1);
  });

  it('loadBooks handles data response', () => {
    const response = {
      data: [
        {
          id: 1,
          title: 'Angular',
        },
      ],

      total: 1,
    };

    bookSpy.getBooks.and.returnValue(of(response as any));

    component.loading = false;

    component.loadBooks();

    expect(component.books.length).toBe(1);
  });

  it('loadBooks handles data.items response', () => {
    const response = {
      data: {
        items: [
          {
            id: 1,
            title: 'Angular',
          },
        ],

        total: 1,
      },
    };

    bookSpy.getBooks.and.returnValue(of(response as any));

    component.loading = false;

    component.loadBooks();

    expect(component.books.length).toBe(1);

    expect(component.totalBooks).toBe(1);
  });

  it('loadBooks handles service error', () => {
    bookSpy.getBooks.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Unable to load books',
        },
      })),
    );

    component.loading = false;

    component.loadBooks();

    expect(component.books).toEqual([]);

    expect(component.totalBooks).toBe(0);

    expect(component.loading).toBeFalse();

    expect(component.errorMessage).toBe('Unable to load books');
  });

  // ============================================================
  // SELECT BOOK FOR UPDATE
  // ============================================================

  it('selectBookForUpdate selects existing book', () => {
    component.books = [
      {
        id: 10,

        title: 'Angular Book',

        author: 'Author',

        category_id: 1,

        publisher: 'Publisher',

        isbn: '123',

        language: 'English',

        pages: 100,

        price: 500,

        stock: 10,

        description: 'Book',
      } as any,
    ];

    component.selectBookForUpdate(10);

    expect(component.isEditMode).toBeTrue();

    expect(component.selectedBookId).toBe(10);

    expect(component.bookForm.get('title')?.value).toBe('Angular Book');
  });

  it('selectBookForUpdate handles missing book', () => {
    component.books = [];

    component.selectBookForUpdate(10);

    expect(component.errorMessage).toBe('Selected book could not be found.');
  });

  // ============================================================
  // UPDATE BOOK
  // ============================================================

  it('updateBook does not update when no book is selected', () => {
    component.isEditMode = false;

    component.selectedBookId = null;

    component.updateBook();

    expect(component.errorMessage).toBe('Select a book to update');

    expect(bookSpy.updateBook).not.toHaveBeenCalled();
  });

  it('updateBook handles success', () => {
    component.isEditMode = true;

    component.selectedBookId = 10;

    component.bookForm.patchValue({
      title: 'Updated',

      author: 'Author',

      category_id: 1,

      publisher: 'Publisher',

      isbn: 'ISBN',

      language: 'English',

      pages: 100,

      price: 500,

      stock: 10,

      description: 'Description',
    });

    bookSpy.updateBook.and.returnValue(
      of({
        success: true,
      } as any),
    );

    spyOn(component, 'loadBooks');

    component.updateBook();

    expect(component.feedbackMessage).toContain('Book updated successfully');

    expect(component.activeTab()).toBe('view');

    expect(component.loadBooks).toHaveBeenCalled();
  });

  it('updateBook handles error', () => {
    component.isEditMode = true;

    component.selectedBookId = 10;

    component.bookForm.patchValue({
      title: 'Updated',

      author: 'Author',

      category_id: 1,

      publisher: 'Publisher',

      isbn: 'ISBN',

      language: 'English',

      pages: 100,

      price: 500,

      stock: 10,

      description: 'Description',
    });

    bookSpy.updateBook.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Update failed',
        },
      })),
    );

    component.updateBook();

    expect(component.errorMessage).toBe('Update failed');

    expect(component.submitting).toBeFalse();
  });

  // ============================================================
  // UPLOAD COVER - VALIDATION
  // ============================================================

  it('uploadCover shows error when file is missing', () => {
    component.selectedBookId = 1;

    component.fileToUpload = null;

    component.uploadCover();

    expect(component.errorMessage).toBe('Select a book and an image first');

    expect(bookSpy.uploadImage).not.toHaveBeenCalled();
  });

  it('uploadCover shows error when book is not selected', () => {
    component.selectedBookId = null;

    component.fileToUpload = new File(['x'], 'a.png', {
      type: 'image/png',
    });

    component.uploadCover();

    expect(component.errorMessage).toBe('Select a book and an image first');

    expect(bookSpy.uploadImage).not.toHaveBeenCalled();
  });

  // ============================================================
  // UPLOAD COVER - PROGRESS
  // ============================================================

  it('uploadCover updates progress during upload', () => {
    component.selectedBookId = 1;

    component.fileToUpload = new File(['x'], 'a.png', {
      type: 'image/png',
    });

    const progressEvent = {
      type: HttpEventType.UploadProgress,

      loaded: 50,

      total: 100,
    } as any;

    bookSpy.uploadImage.and.returnValue(of(progressEvent));

    component.uploadCover();

    expect(component.uploadProgress).toBe(50);
  });

  // ============================================================
  // UPLOAD COVER - RESPONSE
  // ============================================================

  it('uploadCover handles response successfully', () => {
    component.selectedBookId = 1;

    component.fileToUpload = new File(['x'], 'a.png', {
      type: 'image/png',
    });

    const responseEvent = {
      type: HttpEventType.Response,

      body: {
        success: true,

        message: 'Image uploaded',
      },
    } as any;

    bookSpy.uploadImage.and.returnValue(of(responseEvent));

    spyOn(component, 'loadBooks');

    component.uploadCover();

    expect(component.uploading).toBeFalse();

    expect(component.uploadProgress).toBe(100);

    expect(component.feedbackMessage).toContain('Image uploaded');

    expect(component.loadBooks).toHaveBeenCalled();
  });

  // ============================================================
  // UPLOAD COVER - COMPLETE FLOW
  // ============================================================

  it('uploadCover handles progress and response', () => {
    component.selectedBookId = 1;

    component.fileToUpload = new File(['x'], 'a.png', {
      type: 'image/png',
    });

    const progressEvent = {
      type: HttpEventType.UploadProgress,

      loaded: 50,

      total: 100,
    } as any;

    const responseEvent = {
      type: HttpEventType.Response,

      body: {
        success: true,

        message: 'Image uploaded',
      },
    } as any;

    /*
     * First event:
     * uploadProgress becomes 50.
     *
     * Second event:
     * Response is received and the component
     * explicitly changes uploadProgress to 100.
     */

    bookSpy.uploadImage.and.returnValue(of(progressEvent, responseEvent));

    spyOn(component, 'loadBooks');

    component.uploadCover();

    expect(component.uploadProgress).toBe(100);

    expect(component.uploading).toBeFalse();

    expect(component.feedbackMessage).toContain('Image uploaded');

    expect(component.loadBooks).toHaveBeenCalled();
  });

  // ============================================================
  // UPLOAD COVER - ERROR
  // ============================================================

  it('uploadCover handles upload error', () => {
    component.selectedBookId = 1;

    component.fileToUpload = new File(['x'], 'a.png', {
      type: 'image/png',
    });

    bookSpy.uploadImage.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Image upload failed',
        },
      })),
    );

    component.uploadCover();

    expect(component.uploading).toBeFalse();

    expect(component.uploadProgress).toBe(0);

    expect(component.errorMessage).toBe('Image upload failed');
  });

  // ============================================================
  // DELETE BOOK - CANCEL
  // ============================================================

  it('deleteBook cancels when user rejects', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.books = [
      {
        id: 10,
      } as any,
    ];

    component.deleteBook(10);

    expect(component.books.length).toBe(1);

    expect(bookSpy.deleteBook).not.toHaveBeenCalled();
  });

  // ============================================================
  // DELETE BOOK - SUCCESS
  // ============================================================

  it('deleteBook removes book after success', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.books = [
      {
        id: 10,
      } as any,
    ];

    bookSpy.deleteBook.and.returnValue(
      of({
        success: true,

        message: 'Deleted successfully',
      } as any),
    );

    component.deleteBook(10);

    expect(component.books.find((book) => book.id === 10)).toBeUndefined();

    expect(component.deletingBookId).toBeNull();

    expect(component.feedbackMessage).toContain('Book deleted successfully');
  });

  // ============================================================
  // DELETE BOOK - ERROR
  // ============================================================

  it('deleteBook handles error', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.books = [
      {
        id: 10,
      } as any,
    ];

    bookSpy.deleteBook.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Delete failed',
        },
      })),
    );

    component.deleteBook(10);

    /*
     * Book should remain when
     * delete API fails.
     */

    expect(component.books.length).toBe(1);

    expect(component.books[0].id).toBe(10);

    expect(component.deletingBookId).toBeNull();

    expect(component.errorMessage).toBe('Delete failed');
  });
});
