interface Props {
    page: number;
    totalPages: number;
    totalCount: number;
    onChange: (page: number) => void;
    disabled?: boolean;
}

export default function Pagination({ page, totalPages, totalCount, onChange, disabled }: Props) {
    const pages = Math.max(totalPages, 1);

    return (
        <nav className="pagination-bar" aria-label="Pagination Navigation">
            <div className="pagination-info">
                Showing Page <strong>{page}</strong> of <strong>{pages}</strong>
                <span className="pagination-total">({totalCount} candidate{totalCount === 1 ? '' : 's'} found)</span>
            </div>
            <div className="pagination-controls">
                <button
                    type="button"
                    className="btn btn-page"
                    onClick={() => onChange(page - 1)}
                    disabled={disabled || page <= 1}
                    aria-label="Previous Page"
                >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Previous
                </button>
                <div className="page-pill">
                    {page} / {pages}
                </div>
                <button
                    type="button"
                    className="btn btn-page"
                    onClick={() => onChange(page + 1)}
                    disabled={disabled || page >= totalPages}
                    aria-label="Next Page"
                >
                    Next
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}