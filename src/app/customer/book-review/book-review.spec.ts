import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReviews } from './book-review';

describe('BookReview', () => {
  let component: BookReviews;
  let fixture: ComponentFixture<BookReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookReviews],
    }).compileComponents();

    fixture = TestBed.createComponent(BookReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
