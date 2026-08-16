import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories-service';
import { Category, CreateCategoryDto } from '../../interface/category-interface';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class Categories implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);

  // Reactive state
  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly isEmpty = signal(false);

  // Create form state
  readonly createModel = signal<CreateCategoryDto>({ name: '', description: '' });
  readonly categoryImage = signal<File | null>(null);
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);
  readonly createSuccess = signal(false);

  // Delete state
  readonly deletingId = signal<number | null>(null);
  readonly deleteError = signal<string | null>(null);

  constructor() {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load Categories

  private loadCategories(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.isEmpty.set(false);

    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        const items = data || [];
        this.categories.set(items);
        this.isEmpty.set(items.length === 0);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.error.set('Unable to load categories. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  retry(): void {
    this.loadCategories();
  }

  // Create Category

  onCreate(): void {
    const model = this.createModel();
    if (!model.name?.trim()) {
      this.createError.set('Category name is required.');
      return;
    }

    this.isCreating.set(true);
    this.createError.set(null);
    this.createSuccess.set(false);

    this.categoriesService
      .createCategory(
        { name: model.name.trim(), description: model.description?.trim() || '' },
        this.categoryImage() || undefined,
      )
      .subscribe({
        next: () => {
          this.createSuccess.set(true);
          this.isCreating.set(false);
          this.createModel.set({ name: '', description: '' });
          this.categoryImage.set(null);
          this.loadCategories();
          setTimeout(() => this.createSuccess.set(false), 3000);
        },
        error: (err) => {
          console.error('Failed to create category', err);
          this.createError.set(
            err.error?.message ||
              err.error?.detail ||
              'Failed to create category. Please try again.',
          );
          this.isCreating.set(false);
        },
      });
  }

  // Delete Category

  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.deletingId.set(id);
    this.deleteError.set(null);

    this.categoriesService.deleteCategory(id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to delete category', err);
        this.deleteError.set(
          err.error?.message || err.error?.detail || 'Failed to delete category.',
        );
        this.deletingId.set(null);
        setTimeout(() => this.deleteError.set(null), 4000);
      },
    });
  }

  clearCreateError(): void {
    this.createError.set(null);
  }
}
