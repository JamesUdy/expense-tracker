import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'auth_email';

export function useAuth() {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(EMAIL_KEY));

  async function login(emailVal: string, password: string): Promise<void> {
    const result = await authService.login(emailVal, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(EMAIL_KEY, result.email);
    setToken(result.token);
    setEmail(result.email);
  }

  async function register(emailVal: string, password: string): Promise<void> {
    const result = await authService.register(emailVal, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(EMAIL_KEY, result.email);
    setToken(result.token);
    setEmail(result.email);
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail(null);
    queryClient.clear();
  }

  return { token, email, login, register, logout };
}
