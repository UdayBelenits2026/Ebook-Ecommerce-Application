import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { MyordersService } from '../../services/myorders-service';

import { MyOrder, OrderDetail } from '../../interface/myorders-interface';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  private readonly orderService = inject(MyordersService);

  // API

  readonly apiUrl = 'http://127.0.0.1:8000/';

  // DATA

  orders: MyOrder[] = [];

  filteredOrders: MyOrder[] = [];

  // cache details
  private cdr = inject(ChangeDetectorRef);
  orderDetails: Record<number, OrderDetail> = {};

  // MODAL

  isModalOpen = false;

  selectedOrder: MyOrder | null = null;

  selectedOrderDetails: OrderDetail | null = null;

  // PAGE STATE

  loading = false;

  errorMessage = '';

  // SEARCH

  searchText = '';

  selectedStatus = 'ALL';

  readonly statusFilters = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // INIT

  ngOnInit(): void {
    console.log('ngOnInit called');

    this.loadOrders();
  }

  // LOAD ORDERS

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders = (response.data ?? []).filter(
          (order) => order.order_status.toUpperCase() !== 'CANCELLED',
        );

        this.applyFilters();

        this.loading = false;

        // Force Angular to refresh the UI
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);

        this.errorMessage = err?.error?.message ?? 'Unable to load your orders.';

        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // SEARCH

  onSearch(): void {
    this.applyFilters();
  }

  // FILTER

  filterStatus(status: string): void {
    this.selectedStatus = status;

    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredOrders = this.orders.filter((order) => {
      const matchesSearch = search === '' || order.id.toString().includes(search);

      const matchesStatus =
        this.selectedStatus === 'ALL' || order.order_status.toUpperCase() === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  // VIEW DETAILS (MODAL)

  openOrderDetails(order: MyOrder): void {
    this.selectedOrder = order;
    this.isModalOpen = true;

    // If already cached
    if (this.orderDetails[order.id]) {
      this.selectedOrderDetails = this.orderDetails[order.id];
      this.cdr.detectChanges();
      return;
    }

    this.selectedOrderDetails = null;

    this.orderService.getOrder(order.id).subscribe({
      next: (response) => {
        this.orderDetails[order.id] = response.data;
        this.selectedOrderDetails = response.data;

        // Refresh the modal immediately
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);

        alert(err?.error?.message ?? 'Unable to load order details.');

        this.closeModal();

        this.cdr.detectChanges();
      },
    });
  }

  // CLOSE MODAL

  closeModal(): void {
    this.isModalOpen = false;

    this.selectedOrder = null;

    this.selectedOrderDetails = null;
  }

  // GET ORDER DETAIL

  getDetail(orderId: number): OrderDetail | null {
    return this.orderDetails[orderId] ?? null;
  }

  // IMAGE

  getImageUrl(path: string | null | undefined): string {
    if (!path) {
      return 'assets/images/no-book.png';
    }

    if (path.startsWith('http')) {
      return path;
    }

    return this.apiUrl + path;
  }

  // CANCEL ORDER

  cancelOrder(order: MyOrder): void {
    const confirmed = confirm(`Are you sure you want to cancel Order #${order.id}?`);

    if (!confirmed) {
      return;
    }

    this.orderService.cancelOrder(order.id).subscribe({
      next: () => {
        // Remove immediately from UI

        this.orders = this.orders.filter((o) => o.id !== order.id);

        this.filteredOrders = this.filteredOrders.filter((o) => o.id !== order.id);

        // Remove cached details

        delete this.orderDetails[order.id];

        // Close modal if open

        if (this.selectedOrder && this.selectedOrder.id === order.id) {
          this.closeModal();
        }
      },

      error: (err) => {
        console.error(err);

        alert(err?.error?.message ?? 'Unable to cancel order.');
      },
    });
  }

  // STATUS

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'status-pending';

      case 'PROCESSING':
        return 'status-processing';

      case 'SHIPPED':
        return 'status-shipped';

      case 'DELIVERED':
        return 'status-delivered';

      case 'CANCELLED':
        return 'status-cancelled';

      default:
        return '';
    }
  }

  // CANCEL BUTTON

  canCancel(status: string): boolean {
    status = status.toUpperCase();

    return status === 'PENDING' || status === 'PROCESSING';
  }

  // DATE

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // CURRENCY

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  }

  // ITEMS COUNT

  getItemsCount(order: MyOrder): string {
    const count = order.items?.length ?? 0;

    return count === 1 ? '1 Book' : `${count} Books`;
  }

  // TRACK BY

  trackByOrder(index: number, order: MyOrder): number {
    return order.id;
  }
}
