import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  of,
  throwError
} from 'rxjs';

import { AdminOrders } from './admin-orders';
import { AdminOrdersService } from '../../services/admin-orders-service';


describe('AdminOrders', () => {

  let component: AdminOrders;

  let fixture: ComponentFixture<AdminOrders>;

  let serviceSpy: jasmine.SpyObj<AdminOrdersService>;


  beforeEach(async () => {

    serviceSpy = jasmine.createSpyObj(
      'AdminOrdersService',
      [
        'getOrders',
        'getOrder',
        'updateStatus',
        'updateTracking'
      ]
    );


    /*
     * Default response for getOrders().
     *
     * ngOnInit() calls loadOrders(),
     * so this must be defined before detectChanges().
     */
    serviceSpy.getOrders.and.returnValue(

      of({

        success: true,

        message: 'Orders loaded',

        data: []

      } as any)

    );


    /*
     * Default response for getOrder().
     */
    serviceSpy.getOrder.and.returnValue(

      of({

        success: true,

        message: 'Order loaded',

        data: {}

      } as any)

    );


    /*
     * Default response for updateStatus().
     */
    serviceSpy.updateStatus.and.returnValue(

      of({

        success: true,

        message: 'Updated',

        data: null

      } as any)

    );


    /*
     * Default response for updateTracking().
     */
    serviceSpy.updateTracking.and.returnValue(

      of({

        success: true,

        message: 'Updated',

        data: null

      } as any)

    );


    await TestBed.configureTestingModule({

      imports: [
        AdminOrders
      ],

      providers: [

        {
          provide: AdminOrdersService,

          useValue: serviceSpy

        }

      ]

    }).compileComponents();


    fixture = TestBed.createComponent(
      AdminOrders
    );

    component = fixture.componentInstance;


    /*
     * Run Angular lifecycle.
     */
    fixture.detectChanges();

  });


  // ============================================================
  // COMPONENT CREATION
  // ============================================================

  it('should create', () => {

    expect(component)
      .toBeTruthy();

  });


  // ============================================================
  // COMPUTED TOTALS
  // ============================================================

  it('computed totals reflect orders state', () => {

    component.orders.set([

      {
        id: 1,

        order_status: 'PENDING'

      } as any,


      {
        id: 2,

        order_status: 'PROCESSING'

      } as any,


      {
        id: 3,

        order_status: 'SHIPPED'

      } as any,


      {
        id: 4,

        order_status: 'DELIVERED'

      } as any,


      {
        id: 5,

        order_status: 'CANCELLED'

      } as any

    ]);


    /*
     * IMPORTANT:
     *
     * These are computed signals.
     *
     * Therefore use:
     *
     * totalOrders()
     *
     * NOT:
     *
     * totalOrders
     */

    expect(
      component.totalOrders()
    )
      .toBe(5);


    expect(
      component.pendingOrders()
    )
      .toBe(1);


    expect(
      component.processingOrders()
    )
      .toBe(1);


    expect(
      component.shippedOrders()
    )
      .toBe(1);


    expect(
      component.deliveredOrders()
    )
      .toBe(1);


    expect(
      component.cancelledOrders()
    )
      .toBe(1);

  });


  // ============================================================
  // LOAD ORDERS - SUCCESS
  // ============================================================

  it('loadOrders sets orders on success and clears loading', () => {

    const orders = [

      {
        id: 11,

        order_status: 'PENDING'

      }

    ] as any;


    serviceSpy.getOrders.and.returnValue(

      of({

        success: true,

        message: 'Orders loaded successfully',

        data: orders

      } as any)

    );


    component.loadOrders();


    expect(
      component.loading()
    )
      .toBeFalse();


    expect(
      component.orders()
    )
      .toEqual(orders);

  });


  // ============================================================
  // LOAD ORDERS - ERROR
  // ============================================================

  it('loadOrders handles error and sets error message', () => {

    serviceSpy.getOrders.and.returnValue(

      throwError(() => ({

        message: 'Failed'

      }))

    );


    component.loadOrders();


    expect(
      component.loading()
    )
      .toBeFalse();


    expect(
      component.error()
    )
      .toContain(
        'Failed to load orders'
      );

  });


  // ============================================================
  // VIEW ORDER
  // ============================================================

  it('viewOrder sets selectedOrder, tracking and opens modal', () => {

    const orderData = {

      id: 99,

      tracking_number: 'T1',

      courier_name: 'DHL',

      estimated_delivery: '2026-08-10'

    } as any;


    serviceSpy.getOrder.and.returnValue(

      of({

        success: true,

        message: 'Order fetched',

        data: orderData

      } as any)

    );


    component.viewOrder(99);


    expect(
      component.selectedOrder()
    )
      .toEqual(orderData);


    expect(
      component.tracking().tracking_number
    )
      .toBe('T1');


    expect(
      component.showOrderModal()
    )
      .toBeTrue();

  });


  // ============================================================
  // CLOSE MODAL
  // ============================================================

  it('closeModal clears selected order and hides modal', () => {

    component.selectedOrder.set({

      id: 5

    } as any);


    component.showOrderModal.set(true);


    component.closeModal();


    expect(
      component.selectedOrder()
    )
      .toBeNull();


    expect(
      component.showOrderModal()
    )
      .toBeFalse();

  });


  // ============================================================
  // UPDATE STATUS - SUCCESS
  // ============================================================

  it('updateStatus reloads orders and views selected order', () => {

    spyOn(
      component,
      'loadOrders'
    );


    spyOn(
      component,
      'viewOrder'
    );


    serviceSpy.updateStatus.and.returnValue(

      of({

        success: true,

        message: 'Updated',

        data: null

      } as any)

    );


    component.selectedOrder.set({

      id: 123

    } as any);


    component.updateStatus(
      123,
      'SHIPPED'
    );


    expect(
      component.loadOrders
    )
      .toHaveBeenCalled();


    expect(
      component.viewOrder
    )
      .toHaveBeenCalledWith(123);

  });


  // ============================================================
  // UPDATE STATUS - ERROR
  // ============================================================

  it('updateStatus alerts on error', () => {

    serviceSpy.updateStatus.and.returnValue(

      throwError(() => ({}))

    );


    spyOn(
      window,
      'alert'
    );


    component.updateStatus(
      1,
      'SHIPPED'
    );


    expect(
      window.alert
    )
      .toHaveBeenCalledWith(
        'Unable to update order status.'
      );

  });


  // ============================================================
  // SAVE TRACKING - NO ORDER
  // ============================================================

  it('saveTracking returns when no selected order', () => {

    component.selectedOrder.set(null);


    spyOn(
      window,
      'alert'
    );


    component.saveTracking();


    expect(
      window.alert
    )
      .not.toHaveBeenCalled();


    expect(
      serviceSpy.updateTracking
    )
      .not.toHaveBeenCalled();

  });


  // ============================================================
  // SAVE TRACKING - SUCCESS
  // ============================================================

  it('saveTracking updates tracking successfully', () => {

    component.selectedOrder.set({

      id: 55

    } as any);


    component.tracking.set({

      tracking_number: 'X',

      courier_name: 'Y',

      estimated_delivery: 'Z'

    } as any);


    serviceSpy.updateTracking.and.returnValue(

      of({

        success: true,

        message: 'Updated',

        data: null

      } as any)

    );


    spyOn(
      window,
      'alert'
    );


    spyOn(
      component,
      'loadOrders'
    );


    spyOn(
      component,
      'viewOrder'
    );


    component.saveTracking();


    expect(
      window.alert
    )
      .toHaveBeenCalledWith(
        'Tracking details updated successfully.'
      );


    expect(
      component.loadOrders
    )
      .toHaveBeenCalled();


    expect(
      component.viewOrder
    )
      .toHaveBeenCalledWith(55);

  });


  // ============================================================
  // SAVE TRACKING - ERROR
  // ============================================================

  it('saveTracking alerts on failure', () => {

    component.selectedOrder.set({

      id: 10

    } as any);


    serviceSpy.updateTracking.and.returnValue(

      throwError(() => ({}))

    );


    spyOn(
      window,
      'alert'
    );


    component.saveTracking();


    expect(
      window.alert
    )
      .toHaveBeenCalledWith(
        'Failed to update tracking.'
      );

  });

});