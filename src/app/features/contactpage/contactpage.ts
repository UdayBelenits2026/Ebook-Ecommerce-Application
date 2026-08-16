import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contactpage',
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './contactpage.html',
  styleUrls: ['./contactpage.css']
})
export class Contactpage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly submitError = signal<string | null>(null);

  ngOnInit(): void {
    // noop
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.submitError.set('Please complete the form correctly.');
      return;
    }

    this.submitError.set(null);
    this.submitting.set(true);
    this.submitted.set(false);

    const payload = this.contactForm.value;

    this.http.post('https://ebook-ecommerce-backend.onrender.com/contact', payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      finalize(() => this.submitting.set(false))
    ).subscribe({
      next: () => {
        this.submitted.set(true);
        this.contactForm.reset();
        setTimeout(() => this.submitted.set(false), 5000);
      },
      error: (err) => {
        console.error('Contact form submission failed', err);
        this.submitError.set(
          err.error?.message || err.error?.detail || 'Failed to send message. Please try again later.'
        );
      }
    });
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitted.set(false);
    this.submitError.set(null);
  }
}
