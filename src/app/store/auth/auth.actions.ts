import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ credentials: any }>());

export const loginSuccess = createAction('[Auth] Login Success', props<{ response: any }>());

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const signup = createAction('[Auth] Signup', props<{ userData: any }>());

export const signupSuccess = createAction('[Auth] Signup Success', props<{ response: any }>());

export const signupFailure = createAction('[Auth] Signup Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

export const updateAuthUser = createAction(
  '[Auth] Update User',
  props<{ user: Partial<{ id: number; full_name: string; email: string; role: string }> }>(),
);
