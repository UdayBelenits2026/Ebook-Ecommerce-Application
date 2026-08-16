import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { AdminUsersService } from '../../services/admin-users-service';

import {
  AdminUser
} from '../../interface/admin-users-interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  private userService = inject(AdminUsersService);

  users = signal<AdminUser[]>([]);

  loading = signal(false);

  error = signal('');

  ngOnInit(): void {

    this.loadUsers();

  }

  loadUsers() {

    this.loading.set(true);

    this.userService.getUsers().subscribe({

      next: (res) => {

        this.users.set(res.data);

        this.loading.set(false);

      },

      error: () => {

        this.error.set('Unable to load users.');

        this.loading.set(false);

      }

    });

  }

  toggleStatus(user: AdminUser) {

    const status = user.is_active
      ? 'inactive'
      : 'active';

    this.userService
      .updateStatus(user.id, { status })
      .subscribe(() => {

        this.loadUsers();

      });

  }

  deleteUser(id: number) {

    if (!confirm('Delete this user?')) return;

    this.userService
      .deleteUser(id)
      .subscribe(() => {

        this.loadUsers();

      });

  }

}