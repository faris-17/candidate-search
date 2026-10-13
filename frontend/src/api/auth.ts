import { api } from './client';
import type { LoginResponse, RegisterResponse } from '../types';

export async function login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password });
    return data;
}

export async function register(email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/api/auth/register', { email, password });
    return data;
}