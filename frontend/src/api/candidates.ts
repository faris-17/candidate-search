import { api } from './client';
import type { Candidate, PagedResult, SearchFilters, SortBy, SortOrder } from '../types';

export interface SearchParams extends SearchFilters {
    page: number;
    pageSize: number;
    sortBy: SortBy;
    sortOrder: SortOrder;
}

export async function searchCandidates(p: SearchParams, signal?: AbortSignal): Promise<PagedResult<Candidate>> {
    const params: Record<string, string | number> = {
        page: p.page,
        pageSize: p.pageSize,
        sortBy: p.sortBy,
        sortOrder: p.sortOrder,
    };

    if (p.minAge) params.minAge = p.minAge;
    if (p.maxAge) params.maxAge = p.maxAge;
    if (p.gender) params.gender = p.gender;
    if (p.location.trim()) params.location = p.location.trim();
    if (p.education.length > 0) params.education = p.education.join(',');
    if (p.createdFrom) params.createdFrom = p.createdFrom;
    if (p.createdTo) params.createdTo = p.createdTo;
    if (p.lastLoginFrom) params.lastLoginFrom = p.lastLoginFrom;
    if (p.lastLoginTo) params.lastLoginTo = p.lastLoginTo;

    const { data } = await api.get<PagedResult<Candidate>>('/api/candidates/search', { params, signal });
    return data;
}