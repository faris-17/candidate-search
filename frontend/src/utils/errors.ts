import axios from 'axios';
import type { ProblemDetails } from '../types';

/** Converts any thrown error into a readable message for the UI. */
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<ProblemDetails>(error)) {
        if (!error.response) return 'Cannot reach the server. Check your connection and try again.';

        const data = error.response.data;
        if (data?.errors) return Object.values(data.errors).flat().join(' ');
        if (data?.detail) return data.detail;
        if (data?.title) return data.title;
        return `Request failed (status ${error.response.status}).`;
    }
    return 'Something went wrong. Please try again.';
}