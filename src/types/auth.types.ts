// Authentication-related type definitions

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  newPasswordConfirm: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  userId: string;
  email: string;
  userName: string;
}
