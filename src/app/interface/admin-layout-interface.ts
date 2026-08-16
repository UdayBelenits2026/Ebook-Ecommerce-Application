export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminProfile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_image: string | null;
  role: string;
}

export interface UpdateProfileRequest {
  full_name: string;
  phone: string;
}

export interface UpdateProfileResponse {
  full_name: string;
  phone: string;
  profile_image: string | null;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}


export interface UploadProfileImageResponse {
  profile_image: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface SidebarMenu {
  id: number;
  title: string;
  icon: string;
  route: string;
}