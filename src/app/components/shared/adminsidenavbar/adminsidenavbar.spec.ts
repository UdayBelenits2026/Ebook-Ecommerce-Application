import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminSideNavbarComponent } from './adminsidenavbar';
describe('Adminsidenavbar', () => {
  let component: AdminSideNavbarComponent;
  let fixture: ComponentFixture<AdminSideNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSideNavbarComponent],
      providers: [
  provideRouter([])
]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSideNavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
