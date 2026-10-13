export interface LoginResponse {
    token: string;
    expiresIn: number;
}

export interface RegisterResponse {
    id: number;
    email: string;
}

export interface Candidate {
    id: number;
    name: string | null;
    age: number | null;
    gender: string | null;
    education: string | null;
    location: string | null;
    createdAt: string;
    lastLoginAt: string | null;
}

export interface PagedResult<T> {
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export interface SearchFilters {
    minAge: string;
    maxAge: string;
    gender: string;
    location: string;
    education: string[];
    createdFrom: string;
    createdTo: string;
    lastLoginFrom: string;
    lastLoginTo: string;
}

export type SortBy = 'createdAt' | 'lastLoginAt' | 'age';
export type SortOrder = 'asc' | 'desc';

export interface ProblemDetails {
    title?: string;
    detail?: string;
    errors?: Record<string, string[]>;
}