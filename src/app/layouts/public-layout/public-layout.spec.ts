import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { PublicLayout } from './public-layout';

describe('PublicLayout', () => {

  let component: PublicLayout;
  let fixture: ComponentFixture<PublicLayout>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      imports: [
        PublicLayout
      ],

      providers: [
        provideRouter([])
      ]

    }).compileComponents();


    fixture = TestBed.createComponent(PublicLayout);

    component = fixture.componentInstance;

    fixture.detectChanges();

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });


  it('should render the template', () => {

    expect(fixture.nativeElement)
      .toBeTruthy();

  });


  it('should contain the navigation element', () => {

    const nav = fixture.nativeElement
      .querySelector('nav');

    expect(nav)
      .toBeTruthy();

  });


  it('should contain the footer element', () => {

    const footer = fixture.nativeElement
      .querySelector('footer');

    expect(footer)
      .toBeTruthy();

  });

});