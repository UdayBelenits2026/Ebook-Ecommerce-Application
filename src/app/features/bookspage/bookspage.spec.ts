import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Bookspage } from './bookspage';

describe('Bookspage', () => {
  let component: Bookspage;
  let fixture: ComponentFixture<Bookspage>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [Bookspage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              },
              queryParamMap: {
                get: () => null
              }
            },
            paramMap: {
              subscribe: (fn: any) => fn({
                get: () => null
              })
            },
            queryParams: {
              subscribe: (fn: any) => fn({})
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Bookspage);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('creates component and has placeholder image value', () => {
    expect(component).toBeTruthy();
    expect(component.placeholderImage).toContain('no-book.png');
  });

});