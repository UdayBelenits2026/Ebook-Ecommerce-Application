export interface AuthUser {
  id: number | null;
  full_name: string | null;
  email: string | null;
  role: string | null;
}

export interface AuthState {
  user: AuthUser;
  token: string | null;
  tokenType: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: {
    id: localStorage.getItem('id') ? Number(localStorage.getItem('id')) : null,
    full_name: localStorage.getItem('full_name'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role')
  },
  token: localStorage.getItem('access_token'),
  tokenType: localStorage.getItem('token_type'),
  loading: false,
  error: null
};
