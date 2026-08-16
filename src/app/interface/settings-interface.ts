export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}