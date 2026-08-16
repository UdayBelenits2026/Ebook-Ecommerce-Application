// ======================================
// Customer Profile
// ======================================

export interface CustomerProfile {

  id: number;

  full_name: string;

  email: string;

  phone: string;

  profile_image: string | null;

}

// ======================================
// Get Profile Response
// ======================================

export interface CustomerProfileResponse {

  success: boolean;

  message: string;

  data: CustomerProfile;

}

// ======================================
// Update Profile
// ======================================

export interface UpdateCustomerProfileRequest {

  full_name?: string;

  phone?: string;

}

// ======================================
// Upload Image Response
// ======================================

export interface UploadProfileImageResponse {

  success: boolean;

  message: string;

  data: CustomerProfile;

}

// ======================================
// Change Password
// ======================================

export interface ChangePasswordRequest {

  old_password: string;

  new_password: string;

}

export interface ChangePasswordResponse {

  success: boolean;

  message: string;

  data: null;

}

// ======================================
// Sidebar Menu
// ======================================

export interface CustomerSidebarMenu {

  id: number;

  title: string;

  icon: string;

  route: string;

}