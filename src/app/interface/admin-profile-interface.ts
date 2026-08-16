export interface AdminProfile {

  full_name: string;

  email: string;

  phone: string | null;

  profile_image: string | null;

}

export interface AdminProfileUpdate {

  full_name: string;

  phone: string;

}

export interface ChangePassword {

  old_password: string;

  new_password: string;

}

export interface ApiResponse<T> {

  success: boolean;

  message: string;

  data: T;

}