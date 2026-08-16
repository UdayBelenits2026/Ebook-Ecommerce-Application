export interface AdminUser {

  id: number;

  full_name: string;

  email: string;

  phone: string;

  role: string;

  is_active: boolean;

  profile_image: string | null;

  created_at: string;

}

export interface UsersResponse {

  success: boolean;

  message: string;

  data: AdminUser[];

}

export interface StatusUpdate {

  status: string;

}