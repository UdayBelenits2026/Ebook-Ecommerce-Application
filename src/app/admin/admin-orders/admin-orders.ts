import { Component, OnInit, inject, signal, computed } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Store} from '@ngrx/store';
import { AdminOrdersService } from '../../services/admin-orders-service';

import { AdminOrder, TrackingUpdate } from '../../interface/admin-orders-interface';

@Component({
  selector: 'app-admin-orders',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './admin-orders.html',

  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  // SERVICE

  private readonly orderService = inject(AdminOrdersService);

  // ORDERS

  orders = signal<AdminOrder[]>([]);

  // SELECTED ORDER

  selectedOrder = signal<AdminOrder | null>(null);

  // LOADING

  loading = signal(false);

  // ERROR

  error = signal('');

  // MODAL

  showOrderModal = signal(false);

  // TRACKING

  tracking = signal<TrackingUpdate>({
    tracking_number: '',
    courier_name: '',
    estimated_delivery: '',
  });

  // ORDER STATISTICS

  totalOrders = computed(() => {
    return this.orders().length;
  });

  pendingOrders = computed(() => {
    return this.orders().filter((order) => order.order_status === 'PENDING').length;
  });

  processingOrders = computed(() => {
    return this.orders().filter((order) => order.order_status === 'PROCESSING').length;
  });

  shippedOrders = computed(() => {
    return this.orders().filter((order) => order.order_status === 'SHIPPED').length;
  });

  deliveredOrders = computed(() => {
    return this.orders().filter((order) => order.order_status === 'DELIVERED').length;
  });

  cancelledOrders = computed(() => {
    return this.orders().filter((order) => order.order_status === 'CANCELLED').length;
  });

  // LIFECYCLE

  ngOnInit(): void {
    this.loadOrders();
  }

  // LOAD ALL ORDERS
loadOrders(): void {
  this.loading.set(true);

  this.error.set('');

  this.orderService.getOrders().subscribe({
    next: (res) => {
      console.log('ADMIN ORDERS RESPONSE:', res);

      const orders = res?.data ?? [];

      this.orders.set(orders);

      this.loading.set(false);
    },

    error: (err) => {
      console.error('LOAD ORDERS ERROR:', err);

      this.orders.set([]);

      this.loading.set(false);

      this.error.set(
        err?.error?.message ||
        err?.error?.detail ||
        'Failed to load orders.'
      );
    },
  });
}

  // VIEW ORDER

  viewOrder(id: number): void {
    console.log('VIEW ORDER CLICKED:', id);

    // Clear previous error

    this.error.set('');

    // --------------------------------------------------------
    // LOAD SELECTED ORDER
    // --------------------------------------------------------

    this.orderService.getOrder(id).subscribe({
      next: (res) => {
        console.log('GET ORDER RESPONSE:', res);

        // ----------------------------------------------------
        // CHECK RESPONSE
        // ----------------------------------------------------

        if (!res) {
          console.error('Empty response received from getOrder()');

          this.error.set('Unable to load order details.');

          return;
        }

        // ----------------------------------------------------
        // CHECK DATA
        // ----------------------------------------------------

        if (!res.data) {
          console.error('Order data missing:', res);

          this.error.set('Order details were not found.');

          return;
        }

        const order = res.data;

        console.log('SELECTED ORDER DATA:', order);

        // ----------------------------------------------------
        // SET SELECTED ORDER
        // ----------------------------------------------------

        this.selectedOrder.set(order);

        // ----------------------------------------------------
        // SET TRACKING DATA
        // ----------------------------------------------------

        this.tracking.set({
          tracking_number: order.tracking_number ?? '',

          courier_name: order.courier_name ?? '',

          estimated_delivery: this.formatDateForInput(order.estimated_delivery),
        });

        // ----------------------------------------------------
        // OPEN MODAL
        // ----------------------------------------------------

        this.showOrderModal.set(true);

        console.log('SHOW MODAL:', this.showOrderModal());

        console.log('SELECTED ORDER:', this.selectedOrder());
      },

      error: (err) => {
        console.error('GET ORDER ERROR:', err);

        this.error.set(
          err?.error?.message ||
            err?.error?.detail ||
            err?.message ||
            'Failed to load order details.',
        );

        // Make sure modal doesn't remain open
        // when the selected order cannot be loaded.

        this.showOrderModal.set(false);

        this.selectedOrder.set(null);
      },
    });
  }

  // CLOSE MODAL

  closeModal(): void {
    console.log('CLOSING ORDER MODAL');

    this.showOrderModal.set(false);

    this.selectedOrder.set(null);

    this.tracking.set({
      tracking_number: '',

      courier_name: '',

      estimated_delivery: '',
    });
  }

  // UPDATE ORDER STATUS

  updateStatus(id: number, status: string): void {
    console.log('UPDATING ORDER STATUS:', {
      id,
      status,
    });

    if (!id || !status) {
      return;
    }

    this.orderService
      .updateStatus(
        id,

        {
          status,
        },
      )
      .subscribe({
        next: (res) => {
          console.log('STATUS UPDATE RESPONSE:', res);

          // ----------------------------------------------------
          // UPDATE TABLE
          // ----------------------------------------------------

          this.loadOrders();

          // ----------------------------------------------------
          // UPDATE MODAL
          // ----------------------------------------------------

          if (this.selectedOrder() && this.selectedOrder()!.id === id) {
            this.viewOrder(id);
          }
        },

        error: (err) => {
          console.error('STATUS UPDATE ERROR:', err);

          alert(err?.error?.message || err?.error?.detail || 'Unable to update order status.');
        },
      });
  }

  // UPDATE TRACKING FIELD

  updateTrackingField(
    field: 'tracking_number' | 'courier_name' | 'estimated_delivery',

    value: string,
  ): void {
    this.tracking.update((currentTracking) => ({
      ...currentTracking,

      [field]: value,
    }));
  }

  // SAVE TRACKING DETAILS

  saveTracking(): void {
    const order = this.selectedOrder();

    // --------------------------------------------------------
    // CHECK SELECTED ORDER
    // --------------------------------------------------------

    if (!order) {
      console.warn('No selected order found.');

      return;
    }

    const trackingData = this.tracking();

    console.log('SAVING TRACKING:', {
      orderId: order.id,
      tracking: trackingData,
    });

    // --------------------------------------------------------
    // API CALL
    // --------------------------------------------------------

    this.orderService
      .updateTracking(
        order.id,

        trackingData,
      )
      .subscribe({
        next: (res) => {
          console.log('TRACKING UPDATE RESPONSE:', res);

          alert('Tracking details updated successfully.');

          // ----------------------------------------------------
          // REFRESH TABLE
          // ----------------------------------------------------

          this.loadOrders();

          // ----------------------------------------------------
          // REFRESH MODAL
          // ----------------------------------------------------

          this.viewOrder(order.id);
        },

        error: (err) => {
          console.error('TRACKING UPDATE ERROR:', err);

          alert(err?.error?.message || err?.error?.detail || 'Failed to update tracking.');
        },
      });
  }

  // FORMAT DATE FOR HTML DATE INPUT

  private formatDateForInput(date: string | null | undefined): string {
    if (!date) {
      return '';
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    const year = parsedDate.getFullYear();

    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');

    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
