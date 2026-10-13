import { EDUCATION_OPTIONS, GENDER_OPTIONS } from '../constants/constants';
import type { SearchFilters } from '../types';

interface Props {
    value: SearchFilters;
    onChange: (next: SearchFilters) => void;
    onSearch: () => void;
    onReset: () => void;
    disabled?: boolean;
}

export default function FilterForm({ value, onChange, onSearch, onReset, disabled }: Props) {
    const set = <K extends keyof SearchFilters>(key: K, v: SearchFilters[K]) =>
        onChange({ ...value, [key]: v });

    const toggleEducation = (option: string) =>
        set(
            'education',
            value.education.includes(option)
                ? value.education.filter((e) => e !== option)
                : [...value.education, option]
        );

    // Count how many filters are currently applied
    const activeFilterCount =
        (value.minAge ? 1 : 0) +
        (value.maxAge ? 1 : 0) +
        (value.gender ? 1 : 0) +
        (value.location ? 1 : 0) +
        value.education.length +
        (value.createdFrom ? 1 : 0) +
        (value.createdTo ? 1 : 0) +
        (value.lastLoginFrom ? 1 : 0) +
        (value.lastLoginTo ? 1 : 0);

    return (
        <form className="card filter-card" onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
            <div className="filter-header">
                <div className="filter-title-group">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <h2>Filter Candidates</h2>
                    {activeFilterCount > 0 && (
                        <span className="badge badge-active">{activeFilterCount} active</span>
                    )}
                </div>
                <p className="filter-subtitle">Specify candidate demographics, location, education, and activity range</p>
            </div>

            <div className="filter-grid">
                {/* Location */}
                <div className="field-group">
                    <label className="field-label" htmlFor="filter-location">
                        Location
                    </label>
                    <div className="input-with-icon">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <input
                            id="filter-location"
                            type="text"
                            placeholder="e.g. Kochi, Bengaluru, Mumbai"
                            value={value.location}
                            onChange={(e) => set('location', e.target.value)}
                        />
                    </div>
                </div>

                {/* Gender */}
                <div className="field-group">
                    <label className="field-label" htmlFor="filter-gender">
                        Gender
                    </label>
                    <select
                        id="filter-gender"
                        value={value.gender}
                        onChange={(e) => set('gender', e.target.value)}
                    >
                        <option value="">All Genders</option>
                        {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {/* Age Range */}
                <div className="field-group">
                    <label className="field-label">Age Range (Years)</label>
                    <div className="range-inputs">
                        <input
                            type="number"
                            min={0}
                            max={120}
                            placeholder="Min"
                            value={value.minAge}
                            onChange={(e) => set('minAge', e.target.value)}
                            aria-label="Minimum age"
                        />
                        <span className="range-divider">to</span>
                        <input
                            type="number"
                            min={0}
                            max={120}
                            placeholder="Max"
                            value={value.maxAge}
                            onChange={(e) => set('maxAge', e.target.value)}
                            aria-label="Maximum age"
                        />
                    </div>
                </div>

                {/* Created Date Range */}
                <div className="field-group">
                    <label className="field-label">Created Date Range</label>
                    <div className="range-inputs">
                        <input
                            type="date"
                            value={value.createdFrom}
                            onChange={(e) => set('createdFrom', e.target.value)}
                            aria-label="Created from"
                        />
                        <span className="range-divider">to</span>
                        <input
                            type="date"
                            value={value.createdTo}
                            onChange={(e) => set('createdTo', e.target.value)}
                            aria-label="Created to"
                        />
                    </div>
                </div>

                {/* Last Login Range */}
                <div className="field-group">
                    <label className="field-label">Last Login Date Range</label>
                    <div className="range-inputs">
                        <input
                            type="date"
                            value={value.lastLoginFrom}
                            onChange={(e) => set('lastLoginFrom', e.target.value)}
                            aria-label="Last login from"
                        />
                        <span className="range-divider">to</span>
                        <input
                            type="date"
                            value={value.lastLoginTo}
                            onChange={(e) => set('lastLoginTo', e.target.value)}
                            aria-label="Last login to"
                        />
                    </div>
                </div>

                {/* Education Pills */}
                <div className="field-group education-group">
                    <label className="field-label">Education Qualifications (Multi-select)</label>
                    <div className="education-chips">
                        {EDUCATION_OPTIONS.map((option) => {
                            const isChecked = value.education.includes(option);
                            return (
                                <button
                                    type="button"
                                    key={option}
                                    className={`chip ${isChecked ? 'chip-active' : ''}`}
                                    onClick={() => toggleEducation(option)}
                                    aria-pressed={isChecked}
                                >
                                    {isChecked && (
                                        <svg className="chip-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="filter-actions">
                <div className="filter-status-text">
                    {activeFilterCount > 0 ? (
                        <span>Filtering with <strong>{activeFilterCount}</strong> active parameter{activeFilterCount === 1 ? '' : 's'}</span>
                    ) : (
                        <span>No filters active (browsing all candidates)</span>
                    )}
                </div>
                <div className="button-group">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onReset}
                        disabled={disabled || activeFilterCount === 0}
                    >
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Reset Filters
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={disabled}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        Apply Search
                    </button>
                </div>
            </div>
        </form>
    );
}