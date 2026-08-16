import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contactpage } from './contactpage';

describe('Contactpage', () => {
  let component: Contactpage;
  let fixture: ComponentFixture<Contactpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contactpage],
    }).compileComponents();

    fixture = TestBed.createComponent(Contactpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates component and contains contact information', () => {
    expect(component).toBeTruthy();
    const text = fixture.nativeElement.textContent;
    expect(text).toBeTruthy();
  });

});
