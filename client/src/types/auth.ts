export interface AuthResponse {
  token: string;
  email: string;
}

export interface AuthFormState {
  email: string;
  password: string;
}
