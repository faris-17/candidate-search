interface Props {
    page: number;
    totalPages: number;
    totalCount: number;
    onChange: (page: number) => void;
    disabled?: boolean;
}

export default function Pagination({ page, totalPages, totalCount, onChange, disabled }: Props) {
    return (
        <nav className="pagination" aria-label="Pagination">
            <button onClick={() => onChange(page - 1)} disabled={disabled || page <= 1}>Previous</button>
            <span>Page {page} of {Math.max(totalPages, 1)} ({totalCount} results)</span>
            <button onClick={() => onChange(page + 1)} disabled={disabled || page >= totalPages}>Next</button>
        </nav>
    );
}