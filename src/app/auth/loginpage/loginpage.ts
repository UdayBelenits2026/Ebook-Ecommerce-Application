import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.css',
})
export class Loginpage implements OnInit, OnDestroy {
  LoginForm!: FormGroup;

  isLoading = false;
  serverError = '';

  private store = inject(Store);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
    });

    // Loading state
    this.subs.push(
      this.store.select(selectAuthLoading).subscribe((loading) => {
        this.isLoading = loading;

        // Force Angular to check the template
        this.cdr.detectChanges();
      }),
    );

    // Server error state
    this.subs.push(
      this.store.select(selectAuthError).subscribe((error) => {
        this.serverError = error || '';

        // Force Angular to check the template
        this.cdr.detectChanges();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  login(): void {
    // Clear previous server error
    this.serverError = '';

    this.cdr.detectChanges();

    // Validate form
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched();

      this.cdr.detectChanges();

      return;
    }

    const credentials = {
      email: this.LoginForm.value.Email,
      password: this.LoginForm.value.Password,
    };

    // Dispatch login action
    this.store.dispatch(
      AuthActions.login({
        credentials,
      }),
    );
  }
}
