import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { MyOrders } from './my-orders';
import { MyordersService } from '../../services/myorders-service';
import { ChangeDetectorRef } from '@angular/core';

describe('MyOrders', () => {
  let component: MyOrders;
  let fixture: ComponentFixture<MyOrders>;

  let serviceSpy: jasmine.SpyObj<MyordersService>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('MyordersService', ['getOrders', 'getOrder', 'cancelOrder']);

    // Default observable values

    serviceSpy.getOrders.and.returnValue(
      of({
        data: [],
      } as any),
    );

    serviceSpy.getOrder.and.returnValue(
      of({
        data: {},
      } as any),
    );

    serviceSpy.cancelOrder.and.returnValue(of({} as any));

    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [MyOrders],

      providers: [
        {
          provide: MyordersService,
          useValue: serviceSpy,
        },

        {
          provide: ChangeDetectorRef,
          useValue: cdrSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrders);

    component = fixture.componentInstance;
  });

  // ============================================================
  // COMPONENT CREATION
  // ============================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  // DEFAULT VALUES
  // ============================================================

  it('should initialize with default values', () => {
    expect(component.orders).toEqual([]);

    expect(component.filteredOrders).toEqual([]);

    expect(component.loading).toBeFalse();

    expect(component.isModalOpen).toBeFalse();

    expect(component.selectedOrder).toBeNull();
  });

  // ============================================================
  // NG ON INIT
  // ============================================================

  it('ngOnInit should call loadOrders', () => {
    spyOn(component, 'loadOrders');

    component.ngOnInit();

    expect(component.loadOrders).toHaveBeenCalled();
  });

  // ============================================================
  // LOAD ORDERS - SUCCESS
  // ============================================================

  it('loadOrders should load orders successfully and remove cancelled orders', () => {
    serviceSpy.getOrders.and.returnValue(
      of({
        data: [
          {
            id: 1,
            order_status: 'PENDING',
          },

          {
            id: 2,
            order_status: 'CANCELLED',
          },
        ],
      } as any),
    );

    component.loadOrders();

    expect(component.loading).toBeFalse();

    expect(component.orders.length).toBe(1);

    expect(component.orders[0].id).toBe(1);
  });

  // ============================================================
  // LOAD ORDERS - ERROR
  // ============================================================

  it('loadOrders should handle error', () => {
    serviceSpy.getOrders.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Failed',
        },
      })),
    );

    component.loadOrders();

    expect(component.loading).toBeFalse();

    expect(component.errorMessage).toBe('Failed');
  });

  // ============================================================
  // APPLY FILTERS
  // ============================================================

  it('applyFilters filters by search text', () => {
    component.orders = [
      {
        id: 10,
        order_status: 'PENDING',
      } as any,

      {
        id: 20,
        order_status: 'SHIPPED',
      } as any,
    ];

    component.searchText = '10';

    component.applyFilters();

    expect(component.filteredOrders.length).toBe(1);

    expect(component.filteredOrders[0].id).toBe(10);
  });

  // ============================================================
  // FILTER STATUS
  // ============================================================

  it('filterStatus filters orders by status', () => {
    component.orders = [
      {
        id: 1,
        order_status: 'PENDING',
      } as any,

      {
        id: 2,
        order_status: 'DELIVERED',
      } as any,
    ];

    component.filterStatus('DELIVERED');

    expect(component.filteredOrders.length).toBe(1);

    expect(component.filteredOrders[0].id).toBe(2);
  });

  // ============================================================
  // OPEN ORDER DETAILS
  // ============================================================

  it('openOrderDetails loads order details successfully', () => {
    const order = {
      id: 5,

      order_status: 'PENDING',
    } as any;

    const details = {
      id: 5,

      items: [],
    } as any;

    serviceSpy.getOrder.and.returnValue(
      of({
        data: details,
      } as any),
    );

    component.openOrderDetails(order);

    expect(component.selectedOrder).toEqual(order);

    expect(component.isModalOpen).toBeTrue();

    expect(component.selectedOrderDetails).toEqual(details);
  });

  // ============================================================
  // CACHED ORDER DETAILS
  // ============================================================

  it('openOrderDetails uses cached details', () => {
    const order = {
      id: 1,
    } as any;

    component.orderDetails[1] = {
      id: 1,
    } as any;

    component.openOrderDetails(order);

    expect(component.selectedOrderDetails).toEqual({
      id: 1,
    } as any);

    expect(serviceSpy.getOrder).not.toHaveBeenCalled();
  });

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  it('closeModal clears modal data', () => {
    component.isModalOpen = true;

    component.selectedOrder = {
      id: 1,
    } as any;

    component.selectedOrderDetails = {
      id: 1,
    } as any;

    component.closeModal();

    expect(component.isModalOpen).toBeFalse();

    expect(component.selectedOrder).toBeNull();

    expect(component.selectedOrderDetails).toBeNull();
  });

  // ============================================================
  // CANCEL ORDER - SUCCESS
  // ============================================================

  it('cancelOrder should cancel after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const order = {
      id: 10,
    } as any;

    component.orders = [order];

    component.filteredOrders = [order];

    serviceSpy.cancelOrder.and.returnValue(of({} as any));

    component.cancelOrder(order);

    expect(component.orders.length).toBe(0);

    expect(component.filteredOrders.length).toBe(0);
  });

  // ============================================================
  // CANCEL ORDER - CANCELLED
  // ============================================================

  it('cancelOrder should not call API when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.cancelOrder({
      id: 1,
    } as any);

    expect(serviceSpy.cancelOrder).not.toHaveBeenCalled();
  });

  // ============================================================
  // IMAGE URL
  // ============================================================

  it('getImageUrl returns correct urls', () => {
    expect(component.getImageUrl(null)).toContain('no-book.png');

    expect(component.getImageUrl('http://test.com/a.png')).toBe('http://test.com/a.png');

    expect(component.getImageUrl('/img.png')).toContain('/img.png');
  });

  // ============================================================
  // CAN CANCEL
  // ============================================================

  it('canCancel returns correct values', () => {
    expect(component.canCancel('PENDING')).toBeTrue();

    expect(component.canCancel('PROCESSING')).toBeTrue();

    expect(component.canCancel('DELIVERED')).toBeFalse();
  });

  // ============================================================
  // STATUS CLASS
  // ============================================================

  it('getStatusClass returns css class', () => {
    expect(component.getStatusClass('PENDING')).toBe('status-pending');

    expect(component.getStatusClass('SHIPPED')).toBe('status-shipped');
  });

  // ============================================================
  // FORMAT DATE
  // ============================================================

  it('formatDate formats date', () => {
    expect(component.formatDate('2025-01-01')).toContain('2025');
  });

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  it('formatCurrency formats INR', () => {
    expect(component.formatCurrency(1000)).toContain('₹');
  });

  // ============================================================
  // ITEMS COUNT
  // ============================================================

  it('getItemsCount returns item count text', () => {
    expect(
      component.getItemsCount({
        items: [{}],
      } as any),
    ).toBe('1 Book');

    expect(
      component.getItemsCount({
        items: [{}, {}],
      } as any),
    ).toBe('2 Books');
  });

  // ============================================================
  // TRACK BY
  // ============================================================

  it('trackByOrder returns order id', () => {
    expect(
      component.trackByOrder(
        0,

        {
          id: 99,
        } as any,
      ),
    ).toBe(99);
  });
});
