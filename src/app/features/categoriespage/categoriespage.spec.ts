import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { Categoriespage } from './categoriespage';

describe('Categoriespage', () => {

  let component: Categoriespage;
  let fixture: ComponentFixture<Categoriespage>;

  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj<Store>(
      'Store',
      [
        'select',
        'dispatch'
      ]
    );

    storeSpy.select.and.callFake(() => of([]));

    
    await TestBed.configureTestingModule({

      imports: [
        Categoriespage
      ],

      providers: [

        {
          provide: Store,
          useValue: storeSpy
        }

      ]

    }).compileComponents();

    

    fixture = TestBed.createComponent(Categoriespage);

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('creates component and has categories array', () => {

    expect(component).toBeTruthy();

    expect(
      Array.isArray(component.categories)
    ).toBeTrue();

  });

});