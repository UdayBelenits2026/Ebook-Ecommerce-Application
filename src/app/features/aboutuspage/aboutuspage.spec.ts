import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aboutuspage } from './aboutuspage';

describe('Aboutuspage', () => {
  let component: Aboutuspage;
  let fixture: ComponentFixture<Aboutuspage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aboutuspage],
    }).compileComponents();

    fixture = TestBed.createComponent(Aboutuspage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates component and renders content', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toBeTruthy();
  });

});
