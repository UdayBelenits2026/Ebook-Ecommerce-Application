import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  // Admin - manage notifications
  getAdminNotifications() {
    return this.http.get<any>(`${this.baseUrl}/admin/notifications`);
  }

  createAdminNotification(data: any) {
    return this.http.post<any>(`${this.baseUrl}/admin/notifications`, data);
  }

  deleteAdminNotification(id: number | string) {
    return this.http.delete<any>(`${this.baseUrl}/admin/notifications/${id}`);
  }

  // Customer - user notifications
  getUserNotifications() {
    return this.http.get<any>(`${this.baseUrl}/admin/notifications/user`);
  }

  markUserNotificationRead(notificationId: number | string) {
    return this.http.patch<any>(`${this.baseUrl}/admin/notifications/user/${notificationId}/read`, {});
  }

  deleteUserNotification(notificationId: number | string) {
    return this.http.delete<any>(`${this.baseUrl}/admin/notifications/user/${notificationId}`);
  }

}
