import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChildren,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BookService } from '../../services/bookservices';
import { CategoriesService } from '../../services/categories-service';

import { Book } from '../../interface/bookinterface';
import { Category } from '../../interface/category-interface';

@Component({
  selector: 'app-aboutuspage',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './aboutuspage.html',
  styleUrls: ['./aboutuspage.css']
})
export class Aboutuspage implements AfterViewInit, OnDestroy {

  
    //  SERVICES


  private readonly bookService = inject(BookService);

  private readonly categoriesService =
    inject(CategoriesService);

  private readonly router =
    inject(Router);

  private readonly renderer =
    inject(Renderer2);

  private readonly cdr =
    inject(ChangeDetectorRef);



    //  BACKEND DATA


  books: Book[] = [];

  categories: Category[] = [];

  totalBooks = 0;

  totalCategories = 0;


    //  LOADING
 

  booksLoading = true;

  categoriesLoading = true;


    //  ERRORS


  booksError = '';

  categoriesError = '';


  /* 
     PLACEHOLDER
   */

  readonly placeholderImage =
    'assets/images/no-book.png';


  /* 
     STORE FEATURES
   */

  readonly storeHighlights = [

    {
      icon: 'bi bi-book-half',
      title: 'Curated Books',
      text: 'Books selected for every reader'
    },

    {
      icon: 'bi bi-shield-check',
      title: 'Secure Shopping',
      text: 'A safe shopping experience'
    },

    {
      icon: 'bi bi-heart',
      title: 'Easy Wishlist',
      text: 'Save books you want to read'
    },

    {
      icon: 'bi bi-cart3',
      title: 'Simple Cart',
      text: 'Manage books effortlessly'
    },

    {
      icon: 'bi bi-truck',
      title: 'Reliable Delivery',
      text: 'Books delivered with care'
    }

  ];


  /* 
     WHY CHOOSE US
   */

  readonly whyChooseUs = [

    {
      icon: 'bi bi-book-half',
      title: 'Curated Collection',
      text:
        'Explore carefully selected books across fiction, technology, history, science and many more categories.'
    },

    {
      icon: 'bi bi-search',
      title: 'Easy Discovery',
      text:
        'Search, filter and browse our growing catalogue to quickly discover books that match your interests.'
    },

    {
      icon: 'bi bi-heart',
      title: 'Save Your Favourites',
      text:
        'Create your personal wishlist and keep interesting books ready whenever you want to return.'
    },

    {
      icon: 'bi bi-shield-check',
      title: 'Secure Shopping',
      text:
        'Enjoy a simple and reliable shopping experience from discovering a book through checkout.'
    }

  ];


  /* 
     HOW IT WORKS
   */

  readonly steps = [

    {
      number: '01',
      icon: 'bi bi-search',
      title: 'Discover',
      text:
        'Explore books across genres, categories and authors.'
    },

    {
      number: '02',
      icon: 'bi bi-heart',
      title: 'Save',
      text:
        'Keep books you love inside your personal wishlist.'
    },

    {
      number: '03',
      icon: 'bi bi-cart3',
      title: 'Shop',
      text:
        'Add books to your cart and manage quantities easily.'
    },

    {
      number: '04',
      icon: 'bi bi-book',
      title: 'Read',
      text:
        'Complete your order and enjoy your next great read.'
    }

  ];


  /* 
     REVEAL ANIMATION
   */

  private revealObserver?: IntersectionObserver;


  @ViewChildren(
    'revealEl',
    { read: ElementRef }
  )

  revealEls!: QueryList<ElementRef>;


  /* 
     CONSTRUCTOR
   */

  constructor() {

    /*
     * Load backend data immediately when
     * the About component is created.
     */

    this.loadBooks();

    this.loadCategories();

  }


  /* 
     AFTER VIEW INIT
   */

  ngAfterViewInit(): void {

    this.setupRevealObserver();

  }


  /* 
     LOAD BOOKS
   */

  loadBooks(): void {

    this.booksLoading = true;

    this.booksError = '';


    /*
     * We request 10 books because the UI is
     * horizontally scrollable.
     *
     * The backend still returns the real total
     * inside response.total.
     */

    this.bookService
      .getBooks(
        1,
        10,
        '',
        null,
        null,
        null,
        'newest'
      )
      .subscribe({

        next: response => {

          this.books =
            response.items ?? [];

          this.totalBooks =
            Number(
              response.total ?? 0
            );

          this.booksLoading = false;

          this.cdr.detectChanges();

        },


        error: error => {

          console.error(
            'Failed to load books:',
            error
          );

          this.books = [];

          this.totalBooks = 0;

          this.booksLoading = false;

          this.booksError =
            'Unable to load our collection right now.';

          this.cdr.detectChanges();

        }

      });

  }


  /* 
     LOAD CATEGORIES
   */

  loadCategories(): void {

    this.categoriesLoading = true;

    this.categoriesError = '';


    this.categoriesService
      .getCategories()
      .subscribe({

        next: categories => {

          this.categories =
            categories ?? [];

          this.totalCategories =
            this.categories.length;

          this.categoriesLoading = false;

          this.cdr.detectChanges();

        },


        error: error => {

          console.error(
            'Failed to load categories:',
            error
          );

          this.categories = [];

          this.totalCategories = 0;

          this.categoriesLoading = false;

          this.categoriesError =
            'Unable to load categories.';

          this.cdr.detectChanges();

        }

      });

  }


  /* 
     REVEAL OBSERVER
   */

  private setupRevealObserver(): void {

    this.revealObserver =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }


            this.renderer.addClass(
              entry.target,
              'revealed'
            );


            this.revealObserver
              ?.unobserve(
                entry.target
              );

          });

        },

        {
          threshold: 0.08
        }

      );


    this.revealEls.forEach(element => {

      this.revealObserver
        ?.observe(
          element.nativeElement
        );

    });

  }


  /* 
     NAVIGATION
   */

  browseBooks(): void {

    this.router.navigate([
      '/books'
    ]);

  }


  exploreCategories(): void {

    this.router.navigate([
      '/categories'
    ]);

  }


  openBook(book: Book): void {

    /*
     * If you have a dedicated details route,
     * replace this with:
     *
     * this.router.navigate(['/books', book.id]);
     */

    this.router.navigate(
      ['/books'],
      {
        queryParams: {
          search: book.title
        }
      }
    );

  }


  openCategory(
    category: Category
  ): void {

    this.router.navigate(
      ['/books'],
      {
        queryParams: {
          category_id:
            category.id
        }
      }
    );

  }


  /* 
     IMAGE ERROR
   */

  onBookImageError(
    event: Event
  ): void {

    const image =
      event.target as HTMLImageElement;

    image.onerror = null;

    image.src =
      this.placeholderImage;

  }


  /* 
     STAR RATING
   */

  getStars(
    rating: number | null | undefined
  ): number[] {

    const safeRating =
      Math.max(
        0,
        Math.min(
          5,
          Math.round(
            Number(rating ?? 0)
          )
        )
      );


    return Array(
      safeRating
    ).fill(0);

  }


  getEmptyStars(
    rating: number | null | undefined
  ): number[] {

    const safeRating =
      Math.max(
        0,
        Math.min(
          5,
          Math.round(
            Number(rating ?? 0)
          )
        )
      );


    return Array(
      5 - safeRating
    ).fill(0);

  }


  /* 
     TRACK BY
   */

  trackByBook(
    index: number,
    book: Book
  ): number {

    return book.id;

  }


  trackByCategory(
    index: number,
    category: Category
  ): number {

    return category.id;

  }


  /* 
     DESTROY
   */

  ngOnDestroy(): void {

    this.revealObserver
      ?.disconnect();

  }

}