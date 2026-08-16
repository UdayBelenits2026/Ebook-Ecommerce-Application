import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  UsersResponse,
  AdminUser,
  StatusUpdate
} from '../interface/admin-users-interface';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  private http = inject(HttpClient);

  private api = 'https://ebook-ecommerce-backend.onrender.com/admin/users';

  getUsers(): Observable<UsersResponse> {

    const apiRoot = 'https://ebook-ecommerce-backend.onrender.com';

    return this.http.get<UsersResponse>(this.api).pipe(
      map(res => {
        if (res && res.data && Array.isArray(res.data)) {
          res.data = res.data.map((u: AdminUser) => {
            if (u.profile_image) {
              if (!u.profile_image.startsWith('http')) {
                u.profile_image = apiRoot + u.profile_image + '?t=' + Date.now();
              } else {
                u.profile_image = u.profile_image + '?t=' + Date.now();
              }
            }
            return u;
          });
        }
        return res;
      })
    );

  }

  getUser(id: number): Observable<any> {

    return this.http.get(`${this.api}/${id}`);

  }

  updateStatus(
    id: number,
    status: StatusUpdate
  ): Observable<any> {

    return this.http.patch(
      `${this.api}/${id}/status`,
      status
    );

  }

  deleteUser(id: number): Observable<any> {

    return this.http.delete(`${this.api}/${id}`);

  }

}