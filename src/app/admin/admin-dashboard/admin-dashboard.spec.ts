import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { AdminDashboard } from './admin-dashboard';

import { DashboardService } from '../../services/admin-dashboard-service';

describe('AdminDashboard', () => {
  let component: AdminDashboard;

  let fixture: ComponentFixture<AdminDashboard>;

  let dashboardSpy: jasmine.SpyObj<DashboardService>;

  // ============================================================
  // BEFORE EACH
  // ============================================================

  beforeEach(async () => {
    dashboardSpy = jasmine.createSpyObj('DashboardService', ['getDashboardStatistics']);

    // ----------------------------------------------------------
    // Default API response
    // ----------------------------------------------------------

    dashboardSpy.getDashboardStatistics.and.returnValue(
      of({
        success: true,

        message: 'Loaded',

        data: {
          total_revenue: 0,

          low_stock_books: [],
        },
      } as any),
    );

    // ----------------------------------------------------------
    // TestBed
    // ----------------------------------------------------------

    await TestBed.configureTestingModule({
      imports: [AdminDashboard],

      providers: [
        {
          provide: DashboardService,

          useValue: dashboardSpy,
        },
      ],
    }).compileComponents();

    // ----------------------------------------------------------
    // Create component
    // ----------------------------------------------------------

    fixture = TestBed.createComponent(AdminDashboard);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // CREATE
  // ============================================================

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  // DEFAULT VALUES
  // ============================================================

  it('initializes with default values', () => {
    expect(component.dashboardStatistics()).toBeTruthy();

    expect(component.lowStockBooks()).toEqual([]);

    expect(component.isLoading()).toBeFalse();

    expect(component.errorMessage()).toBe('');
  });

  // ============================================================
  // LOAD DASHBOARD SUCCESS
  // ============================================================

  it('loadDashboardStatistics loads dashboard data successfully', (done) => {
    const response = {
      success: true,

      message: 'Dashboard loaded',

      data: {
        total_revenue: 12345,

        low_stock_books: [
          {
            id: 1,

            title: 'Angular Book',

            stock: 5,
          },
        ],
      },
    } as any;

    dashboardSpy.getDashboardStatistics.and.returnValue(of(response));

    const revenueSpy = spyOn<any>(component, 'createRevenueChart').and.stub();

    const ordersSpy = spyOn<any>(component, 'createOrdersChart').and.stub();

    component.loadDashboardStatistics();

    // --------------------------------------------------------
    // Synchronous API response assertions
    // --------------------------------------------------------

    expect(component.dashboardStatistics()?.total_revenue).toBe(12345);

    expect(component.lowStockBooks().length).toBe(1);

    expect(component.lowStockBooks()[0].id).toBe(1);

    expect(component.lowStockBooks()[0].title).toBe('Angular Book');

    expect(component.lowStockBooks()[0].stock).toBe(5);

    expect(component.isLoading()).toBeFalse();

    // --------------------------------------------------------
    // Wait for setTimeout()
    // --------------------------------------------------------

    setTimeout(() => {
      expect(revenueSpy).toHaveBeenCalled();

      expect(ordersSpy).toHaveBeenCalled();

      done();
    }, 10);
  });

  // ============================================================
  // SERVICE ERROR
  // ============================================================

  it('loadDashboardStatistics handles service error', () => {
    dashboardSpy.getDashboardStatistics.and.returnValue(
      throwError(() => ({
        message: 'Server error',
      })),
    );

    component.loadDashboardStatistics();

    expect(component.errorMessage()).toBe('Server error');

    expect(component.isLoading()).toBeFalse();
  });

  // ============================================================
  // UNKNOWN ERROR
  // ============================================================

  it('loadDashboardStatistics handles unknown error', () => {
    dashboardSpy.getDashboardStatistics.and.returnValue(throwError(() => ({})));

    component.loadDashboardStatistics();

    expect(component.errorMessage()).toBe('Unable to load dashboard data');

    expect(component.isLoading()).toBeFalse();
  });

  // ============================================================
  // NULL ERROR
  // ============================================================

  it('loadDashboardStatistics handles null error', () => {
    dashboardSpy.getDashboardStatistics.and.returnValue(throwError(() => null));

    component.loadDashboardStatistics();

    expect(component.errorMessage()).toBe('Unable to load dashboard data');

    expect(component.isLoading()).toBeFalse();
  });

  // ============================================================
  // REFRESH
  // ============================================================

  it('refreshDashboard calls loadDashboardStatistics', () => {
    spyOn(component, 'loadDashboardStatistics');

    component.refreshDashboard();

    expect(component.loadDashboardStatistics).toHaveBeenCalled();
  });
});
