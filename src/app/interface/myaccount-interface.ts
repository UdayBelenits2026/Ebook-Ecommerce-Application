export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_image: string;
  role: string;
  is_verified: boolean;
  joined_date: string;
}

export interface UpdateProfileRequest {
  full_name: string;
  phone: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UploadAvatarResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_image: string;
  role: string;
  joined_date: string;
}