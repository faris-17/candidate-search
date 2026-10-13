import type { Candidate } from '../types';
import { formatDate } from '../utils/format';

export default function ResultsTable({ items }: { items: Candidate[] }) {
    const getInitials = (name?: string | null) => {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="table-responsive-container">
            <div className="desktop-table-wrap">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th style={{ width: '28%' }}>Candidate</th>
                            <th style={{ width: '10%' }}>Age</th>
                            <th style={{ width: '12%' }}>Gender</th>
                            <th style={{ width: '14%' }}>Education</th>
                            <th style={{ width: '14%' }}>Location</th>
                            <th style={{ width: '11%' }}>Created</th>
                            <th style={{ width: '11%' }}>Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((c) => (
                            <tr key={c.id} className="candidate-row">
                                <td>
                                    <div className="candidate-profile">
                                        <div className="avatar">{getInitials(c.name)}</div>
                                        <div className="candidate-meta">
                                            <span className="candidate-name">{c.name ?? 'Unnamed Candidate'}</span>
                                            <span className="candidate-id">ID: #{c.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="age-badge">{c.age != null ? `${c.age} yrs` : '—'}</span>
                                </td>
                                <td>
                                    {c.gender ? (
                                        <span className={`gender-tag gender-${c.gender.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {c.gender}
                                        </span>
                                    ) : '—'}
                                </td>
                                <td>
                                    {c.education ? (
                                        <span className="edu-badge">{c.education}</span>
                                    ) : '—'}
                                </td>
                                <td>
                                    {c.location ? (
                                        <div className="location-cell">
                                            <svg className="loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            <span>{c.location}</span>
                                        </div>
                                    ) : '—'}
                                </td>
                                <td className="td-date">{formatDate(c.createdAt)}</td>
                                <td className="td-date">{formatDate(c.lastLoginAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mobile-candidate-cards" aria-label="Candidate list">
                {items.map((c) => (
                    <article key={c.id} className="candidate-mobile-card">
                        <div className="card-top-row">
                            <div className="candidate-profile">
                                <div className="avatar">{getInitials(c.name)}</div>
                                <div className="candidate-meta">
                                    <span className="candidate-name">{c.name ?? 'Unnamed Candidate'}</span>
                                    <span className="candidate-id">ID: #{c.id}</span>
                                </div>
                            </div>
                            <span className="age-badge">{c.age != null ? `${c.age} yrs` : '—'}</span>
                        </div>

                        <div className="card-badge-row">
                            {c.gender && (
                                <span className={`gender-tag gender-${c.gender.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {c.gender}
                                </span>
                            )}
                            {c.education && (
                                <span className="edu-badge">{c.education}</span>
                            )}
                            {c.location && (
                                <div className="location-cell mobile-loc">
                                    <svg className="loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{c.location}</span>
                                </div>
                            )}
                        </div>

                        <div className="card-dates-row">
                            <div className="date-item">
                                <span className="date-label">Created:</span>
                                <span className="date-value">{formatDate(c.createdAt)}</span>
                            </div>
                            <div className="date-item">
                                <span className="date-label">Last Login:</span>
                                <span className="date-value">{formatDate(c.lastLoginAt)}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}