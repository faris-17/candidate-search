import type { SearchFilters } from '../types';

export const PAGE_SIZE = 20;
export const EDUCATION_OPTIONS = ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'PhD'];
export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const EMPTY_FILTERS: SearchFilters = {
    minAge: '',
    maxAge: '',
    gender: '',
    location: '',
    education: [],
    createdFrom: '',
    createdTo: '',
    lastLoginFrom: '',
    lastLoginTo: '',
};