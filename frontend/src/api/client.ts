import axios from 'axios';
import { tokenStorage } from '../auth/tokenStorage';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const token = tokenStorage.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const isAuthCall = axios.isAxiosError(error) && error.config?.url?.startsWith('/api/auth/');
        if (axios.isAxiosError(error) && error.response?.status === 401 && !isAuthCall) {
            tokenStorage.clear();
            window.location.assign('/login');
        }
        return Promise.reject(error);
    },
);