import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { finalize } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { CheckoutService } from '../../services/checkout-service';
import { AddressService } from '../../services/address-service';
import { AuthService } from '../../services/auth-services';

import { CartItem } from '../../interface/cart-interface';

import { Address, AddressRequest } from '../../interface/address-interface';

import { PlaceOrderRequest } from '../../interface/checkout-interface';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class Checkout implements OnInit {
  // SERVICES

  private readonly cartService = inject(CartService);

  private readonly checkoutService = inject(CheckoutService);

  private readonly addressService = inject(AddressService);

  private readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  // CART

  cartItems: CartItem[] = [];

  cartCount = 0;

  subtotal = 0;

  shipping = 0;

  grandTotal = 0;

  // ADDRESS

  addresses: Address[] = [];

  selectedAddressId = 0;

  // ORDER

  order: PlaceOrderRequest = {
    payment_method: '',

    address_id: 0,
  };

  // PAYMENT METHODS

  paymentMethods = [
    {
      value: 'COD',
      title: 'Cash on Delivery',
      icon: 'bi-cash-stack',
    },
  ];

  // ADDRESS MODAL

  showAddressModal = false;

  editingAddress = false;

  editingAddressId = 0;

  addressForm: AddressRequest = {
    full_name: '',

    mobile: '',

    house_no: '',

    street: '',

    area: '',

    village_city: '',

    district: '',

    state: '',

    pincode: '',

    landmark: '',

    is_default: false,
  };

  // PAGE STATE

  loadingCart = false;

  loadingAddresses = false;

  savingAddress = false;

  placingOrder = false;

  errorMessage = '';

  successMessage = '';

  // IMAGE

  readonly placeholderImage = 'assets/images/no-book.png';

  // INIT

  async ngOnInit(): Promise<void> {
    if (!this.auth.isUserLoggedIn()) {
      this.router.navigate(['/login']);

      return;
    }

    this.loadCart();

    this.loadAddresses();
  }

  // CHANGE DETECTION

  private detectChanges(): void {
    try {
      this.cdr.detectChanges();
    } catch {}
  }

  // LOAD CART

  loadCart(): void {
    this.loadingCart = true;

    this.errorMessage = '';

    this.detectChanges();

    this.cartService
      .getCart()
      .pipe(
        finalize(() => {
          this.loadingCart = false;

          this.detectChanges();
        }),
      )
      .subscribe({
        next: (response: any) => {
          const data = response?.data;

          if (!data) {
            this.cartItems = [];

            this.cartCount = 0;

            this.subtotal = 0;

            this.shipping = 0;

            this.grandTotal = 0;

            return;
          }

          this.cartItems = Array.isArray(data.items) ? [...data.items] : [];

          this.cartCount = Number(data.cart_count) || 0;

          this.subtotal = Number(data.subtotal) || 0;

          this.shipping = Number(data.shipping) || 0;

          this.grandTotal = Number(data.grand_total) || 0;

          this.detectChanges();
        },

        error: (err) => {
          console.error('Failed to load cart', err);

          this.errorMessage = err?.error?.detail ?? err?.error?.message ?? 'Unable to load cart.';

          this.cartItems = [];

          this.detectChanges();
        },
      });
  }

  // LOAD ADDRESSES

  loadAddresses(): void {
    this.loadingAddresses = true;

    this.addressService
      .getAddresses()
      .pipe(
        finalize(() => {
          this.loadingAddresses = false;

          this.detectChanges();
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.addresses = Array.isArray(response?.data) ? response.data : [];

          if (this.addresses.length === 0) {
            this.selectedAddressId = 0;

            this.order.address_id = 0;

            return;
          }

          const defaultAddress = this.addresses.find((a) => a.is_default);

          if (defaultAddress) {
            this.selectedAddressId = defaultAddress.id;
          } else {
            this.selectedAddressId = this.addresses[0].id;
          }

          this.order.address_id = this.selectedAddressId;

          this.detectChanges();
        },

        error: (err) => {
          console.error(err);

          this.errorMessage =
            err?.error?.detail ?? err?.error?.message ?? 'Unable to load addresses.';
        },
      });
  }

  // ADDRESS

  selectAddress(address: Address): void {
    this.selectedAddressId = address.id;

    this.order.address_id = address.id;
  }

  get selectedAddress(): Address | undefined {
    return this.addresses.find((address) => address.id === this.selectedAddressId);
  }

  // PAYMENT

  selectPayment(method: string): void {
    this.order.payment_method = method;
  }

  isPaymentSelected(method: string): boolean {
    return this.order.payment_method === method;
  }

  // HELPERS

  get isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  get totalItems(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity,

      0,
    );
  }

  trackByCart(index: number, item: CartItem): number {
    return item.book_id;
  }

  trackByAddress(index: number, address: Address): number {
    return address.id;
  }

  // ADDRESS MODAL

  openAddAddressModal(): void {
    this.editingAddress = false;

    this.editingAddressId = 0;

    this.addressForm = {
      full_name: '',

      mobile: '',

      house_no: '',

      street: '',

      area: '',

      village_city: '',

      district: '',

      state: '',

      pincode: '',

      landmark: '',

      is_default: false,
    };

    this.showAddressModal = true;
  }

  openEditAddressModal(address: Address): void {
    this.editingAddress = true;

    this.editingAddressId = address.id;

    this.addressForm = {
      full_name: address.full_name,

      mobile: address.mobile,

      house_no: address.house_no,

      street: address.street ?? '',

      area: address.area,

      village_city: address.village_city,

      district: address.district,

      state: address.state,

      pincode: address.pincode,

      landmark: address.landmark ?? '',

      is_default: address.is_default,
    };

    this.showAddressModal = true;
  }

  closeAddressModal(): void {
    this.showAddressModal = false;

    this.editingAddress = false;

    this.editingAddressId = 0;

    this.resetAddressForm();
  }

  cancelAddress(): void {
    this.closeAddressModal();
  }

  // SAVE ADDRESS

  saveAddress(): void {
    if (!this.validateAddress()) {
      return;
    }

    this.savingAddress = true;

    const request = this.editingAddress
      ? this.addressService.updateAddress(this.editingAddressId, this.addressForm)
      : this.addressService.addAddress(this.addressForm);

    request
      .pipe(
        finalize(() => {
          this.savingAddress = false;

          this.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.closeAddressModal();

          this.loadAddresses();
        },

        error: (err) => {
          console.error(err);

          this.errorMessage =
            err?.error?.detail ?? err?.error?.message ?? 'Unable to save address.';
        },
      });
  }

  // DELETE ADDRESS

  deleteAddress(address: Address): void {
    const ok = confirm(`Delete address for ${address.full_name}?`);

    if (!ok) {
      return;
    }

    this.addressService.deleteAddress(address.id).subscribe({
      next: () => {
        this.loadAddresses();
      },

      error: (err) => {
        console.error(err);

        this.errorMessage =
          err?.error?.detail ?? err?.error?.message ?? 'Unable to delete address.';
      },
    });
  }

  // ADDRESS VALIDATION

  validateAddress(): boolean {
    if (!this.addressForm.full_name.trim()) {
      this.errorMessage = 'Full name is required.';

      return false;
    }

    if (!this.addressForm.mobile.trim()) {
      this.errorMessage = 'Mobile number is required.';

      return false;
    }

    if (!/^[0-9]{10}$/.test(this.addressForm.mobile)) {
      this.errorMessage = 'Enter a valid mobile number.';

      return false;
    }

    if (!this.addressForm.house_no.trim()) {
      this.errorMessage = 'House / Flat number is required.';

      return false;
    }

    if (!this.addressForm.area.trim()) {
      this.errorMessage = 'Area is required.';

      return false;
    }

    if (!this.addressForm.village_city.trim()) {
      this.errorMessage = 'City is required.';

      return false;
    }

    if (!this.addressForm.district.trim()) {
      this.errorMessage = 'District is required.';

      return false;
    }

    if (!this.addressForm.state.trim()) {
      this.errorMessage = 'State is required.';

      return false;
    }

    if (!/^[0-9]{6}$/.test(this.addressForm.pincode)) {
      this.errorMessage = 'Enter a valid PIN code.';

      return false;
    }

    this.errorMessage = '';

    return true;
  }

  // RESET ADDRESS FORM

  resetAddressForm(): void {
    this.addressForm = {
      full_name: '',

      mobile: '',

      house_no: '',

      street: '',

      area: '',

      village_city: '',

      district: '',

      state: '',

      pincode: '',

      landmark: '',

      is_default: false,
    };
  }

  // PLACE ORDER

  placeOrder(): void {
    this.errorMessage = '';

    this.successMessage = '';

    // ----------------------------------------------------------
    // ADDRESS VALIDATION
    // ----------------------------------------------------------

    if (!this.order.address_id) {
      this.errorMessage = 'Please select a delivery address.';

      return;
    }

    // ----------------------------------------------------------
    // PAYMENT VALIDATION
    // ----------------------------------------------------------

    if (!this.order.payment_method) {
      this.errorMessage = 'Please select a payment method.';

      return;
    }

    // ----------------------------------------------------------
    // CART VALIDATION
    // ----------------------------------------------------------

    if (this.cartItems.length === 0) {
      this.errorMessage = 'Your cart is empty.';

      return;
    }

    // ----------------------------------------------------------
    // CASH ON DELIVERY
    // ----------------------------------------------------------

    if (this.order.payment_method === 'COD') {
      this.placeCashOnDelivery();

      return;
    }
  }

  // CASH ON DELIVERY

  private placeCashOnDelivery(): void {
    this.placingOrder = true;

    this.detectChanges();

    this.checkoutService
      .placeOrder(this.order)
      .pipe(
        finalize(() => {
          this.placingOrder = false;

          this.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = '🎉 Order placed successfully! Redirecting to My Orders...';

          this.loadCart();

          this.cartService.cartChanged.next();

          this.cartItems = [];

          this.cartCount = 0;

          this.subtotal = 0;

          this.shipping = 0;

          this.grandTotal = 0;

          setTimeout(() => {
            this.router.navigate(['/customer/my-orders']);
          }, 4000);
        },

        error: (err) => {
          console.error(err);

          this.errorMessage = err?.error?.detail ?? err?.error?.message ?? 'Unable to place order.';
        },
      });
  }

  // BUTTON STATE

  canPlaceOrder(): boolean {
    return (
      this.cartItems.length > 0 &&
      this.order.address_id > 0 &&
      this.order.payment_method !== '' &&
      !this.placingOrder
    );
  }

  // PRICE HELPERS

  getSubtotal(): number {
    return this.subtotal;
  }

  getShipping(): number {
    return this.shipping;
  }

  getGrandTotal(): number {
    return this.grandTotal;
  }

  // FORMAT ADDRESS

  getAddressLabel(address: Address): string {
    return [
      address.house_no,

      address.street,

      address.area,

      address.village_city,

      address.district,

      address.state,

      address.pincode,
    ]

      .filter(Boolean)

      .join(', ');
  }

  // FORMAT CURRENCY

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  }
}
