import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCandidates } from '../api/candidates';
import { tokenStorage } from '../auth/tokenStorage';
import CustomSelect, { type SelectOption } from '../components/CustomSelect';
import FilterForm from '../components/FilterForm';
import Pagination from '../components/Pagination';
import ResultsTable from '../components/ResultsTable';
import { EMPTY_FILTERS, PAGE_SIZE } from '../constants/constants';
import type { Candidate, PagedResult, SearchFilters, SortBy, SortOrder } from '../types';
import { getErrorMessage } from '../utils/errors';

const sortByOptions: SelectOption[] = [
    {
        value: 'createdAt',
        label: 'Registration Date',
        icon: (
            <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
    },
    {
        value: 'lastLoginAt',
        label: 'Last Login Date',
        icon: (
            <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        value: 'age',
        label: 'Candidate Age',
        icon: (
            <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
];

const sortOrderOptions: SelectOption[] = [
    {
        value: 'desc',
        label: 'Descending (Newest / High First)',
        icon: (
            <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
            </svg>
        ),
    },
    {
        value: 'asc',
        label: 'Ascending (Oldest / Low First)',
        icon: (
            <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
            </svg>
        ),
    },
];

export default function SearchPage() {
    const navigate = useNavigate();

    const [draft, setDraft] = useState<SearchFilters>(EMPTY_FILTERS);
    const [applied, setApplied] = useState<SearchFilters>(EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortBy>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const [data, setData] = useState<PagedResult<Candidate> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        searchCandidates({ ...applied, page, pageSize: PAGE_SIZE, sortBy, sortOrder }, controller.signal)
            .then(setData)
            .catch((err: unknown) => {
                if (!axios.isCancel(err)) setError(getErrorMessage(err));
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [applied, page, sortBy, sortOrder]);

    const handleSearch = () => {
        setApplied(draft);
        setPage(1);
    };

    const handleReset = () => {
        setDraft(EMPTY_FILTERS);
        setApplied(EMPTY_FILTERS);
        setSortBy('createdAt');
        setSortOrder('desc');
        setPage(1);
    };

    const handleLogout = () => {
        tokenStorage.clear();
        navigate('/login', { replace: true });
    };

    const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;

    return (
        <div className="app-shell">
            <header className="navbar">
                <div className="navbar-container">
                    <div className="brand">
                        <div className="brand-logo">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <circle cx="11" cy="11" r="3" />
                            </svg>
                        </div>
                        <div className="brand-text">
                            <span className="brand-title">CandidateSearch</span>
                            <span className="brand-badge">Talent Intelligence Portal</span>
                        </div>
                    </div>
                    <div className="navbar-actions">
                        <div className="user-indicator">
                            <span className="status-dot"></span>
                            <span>Connected</span>
                        </div>
                        <button className="btn btn-outline" onClick={handleLogout}>
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Candidate Directory</h1>
                        <p className="page-desc">Search, filter, and review prospective candidate profiles in real-time</p>
                    </div>
                </div>

                <FilterForm
                    value={draft}
                    onChange={setDraft}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    disabled={loading}
                />

                <section className="card results-card">
                    <div className="results-toolbar">
                        <div className="results-summary">
                            <h2>Directory Results</h2>
                            {data && (
                                <span className="results-count-badge">
                                    {data.totalCount} candidate{data.totalCount === 1 ? '' : 's'}
                                </span>
                            )}
                        </div>

                        <div className="sort-controls">
                            <span className="sort-label">Sort By:</span>
                            <CustomSelect
                                className="sort-custom-select"
                                value={sortBy}
                                onChange={(val) => { setSortBy(val as SortBy); setPage(1); }}
                                options={sortByOptions}
                                disabled={loading}
                                ariaLabel="Sort candidate results by field"
                            />

                            <CustomSelect
                                className="sort-custom-select order-select"
                                value={sortOrder}
                                onChange={(val) => { setSortOrder(val as SortOrder); setPage(1); }}
                                options={sortOrderOptions}
                                disabled={loading}
                                ariaLabel="Sort candidate results order"
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="state-container loading-state">
                            <div className="spinner"></div>
                            <p>Querying candidates from database...</p>
                        </div>
                    )}

                    {error && (
                        <div className="state-container error-state" role="alert">
                            <svg className="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <div>
                                <h3>Failed to load candidate results</h3>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {!loading && !error && data && data.items.length === 0 && (
                        <div className="state-container empty-state">
                            <div className="empty-icon-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <line x1="8" y1="11" x2="14" y2="11" />
                                </svg>
                            </div>
                            <h3>No Candidates Match Your Filters</h3>
                            <p>Try clearing some criteria or widening your age, location, and date range.</p>
                            <button className="btn btn-secondary" onClick={handleReset}>
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    {!error && data && data.items.length > 0 && (
                        <div className={`table-container ${loading ? 'dimmed' : ''}`}>
                            <ResultsTable items={data.items} />
                            <Pagination
                                page={data.page}
                                totalPages={totalPages}
                                totalCount={data.totalCount}
                                onChange={setPage}
                                disabled={loading}
                            />
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}