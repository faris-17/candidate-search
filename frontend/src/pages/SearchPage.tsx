import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCandidates } from '../api/candidates';
import { tokenStorage } from '../auth/tokenStorage';
import FilterForm from '../components/FilterForm';
import Pagination from '../components/Pagination';
import ResultsTable from '../components/ResultsTable';
import { EMPTY_FILTERS, PAGE_SIZE } from '../constants';
import type { Candidate, PagedResult, SearchFilters, SortBy, SortOrder } from '../types';
import { getErrorMessage } from '../utils/errors';

export default function SearchPage() {
    const navigate = useNavigate();

    const [draft, setDraft] = useState<SearchFilters>(EMPTY_FILTERS);     // what the user is typing
    const [applied, setApplied] = useState<SearchFilters>(EMPTY_FILTERS); // what was actually searched
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortBy>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const [data, setData] = useState<PagedResult<Candidate> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // One effect = one place that fetches. It re-runs whenever any search input changes.
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

        return () => controller.abort();   // cleanup: cancel the previous request
    }, [applied, page, sortBy, sortOrder]);

    const handleSearch = () => {
        setApplied(draft);
        setPage(1);                        // a new search always starts at page 1
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
        <main className="search-page">
            <header className="topbar">
                <h1>Candidate Search</h1>
                <button className="secondary" onClick={handleLogout}>Logout</button>
            </header>

            <FilterForm value={draft} onChange={setDraft} onSearch={handleSearch}
                onReset={handleReset} disabled={loading} />

            <section className="results card">
                <div className="sort-bar">
                    <label>
                        Sort by{' '}
                        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortBy); setPage(1); }}>
                            <option value="createdAt">Created date</option>
                            <option value="lastLoginAt">Last login</option>
                            <option value="age">Age</option>
                        </select>
                    </label>
                    <label>
                        <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value as SortOrder); setPage(1); }}
                            aria-label="Sort order">
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </label>
                </div>

                {loading && <p className="status" role="status">Loading candidates...</p>}

                {error && <p className="error" role="alert">{error}</p>}

                {!loading && !error && data && data.items.length === 0 && (
                    <p className="status">No candidates match your filters.</p>
                )}

                {!error && data && data.items.length > 0 && (
                    <div className={loading ? 'dimmed' : undefined}>
                        <ResultsTable items={data.items} />
                        <Pagination page={data.page} totalPages={totalPages} totalCount={data.totalCount}
                            onChange={setPage} disabled={loading} />
                    </div>
                )}
            </section>
        </main>
    );
}