import { useMemo, useState } from 'react';
import CustomSelect, { type SelectOption } from './CustomSelect';
import MultiSelectDropdown, { type MultiOption } from './MultiSelectDropdown';
import { EDUCATION_OPTIONS, LOCATION_OPTIONS } from '../constants/constants';
import type { SearchFilters } from '../types';

interface Props {
    value: SearchFilters;
    onChange: (next: SearchFilters) => void;
    onSearch: () => void;
    onReset: () => void;
    disabled?: boolean;
}

export default function FilterForm({ value, onChange, onSearch, onReset, disabled }: Props) {
    const [showCustomAge, setShowCustomAge] = useState(false);
    const [showCustomCreated, setShowCustomCreated] = useState(false);
    const [showCustomLogin, setShowCustomLogin] = useState(false);

    const set = <K extends keyof SearchFilters>(key: K, v: SearchFilters[K]) =>
        onChange({ ...value, [key]: v });

    const today = new Date().toISOString().split('T')[0];
    const daysAgo = (days: number) => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d.toISOString().split('T')[0];
    };
    const startOfYear = `${new Date().getFullYear()}-01-01`;

    const locationOptions: SelectOption[] = useMemo(() => [
        {
            value: '',
            label: 'All Locations',
            description: 'Search across all candidate cities',
            icon: (
                <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            ),
        },
        ...LOCATION_OPTIONS.map((loc) => ({
            value: loc,
            label: loc,
            badge: <span className="loc-badge">{loc}</span>,
            icon: (
                <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
        })),
    ], []);

    const genderOptions: SelectOption[] = useMemo(() => [
        {
            value: '',
            label: 'All Genders',
            description: 'Include any gender identity',
            icon: (
                <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            value: 'Male',
            label: 'Male',
            description: 'Identified as Male',
            icon: <span className="gender-glyph male-glyph">♂</span>,
            badge: <span className="gender-tag gender-male">Male</span>,
        },
        {
            value: 'Female',
            label: 'Female',
            description: 'Identified as Female',
            icon: <span className="gender-glyph female-glyph">♀</span>,
            badge: <span className="gender-tag gender-female">Female</span>,
        },
        {
            value: 'Other',
            label: 'Other',
            description: 'Non-binary & other gender identities',
            icon: <span className="gender-glyph other-glyph">⚥</span>,
            badge: <span className="gender-tag gender-other">Other</span>,
        },
    ], []);

    const educationOptions: MultiOption[] = useMemo(() =>
        EDUCATION_OPTIONS.map((edu) => ({
            value: edu,
            label: edu,
            badge: <span className="edu-badge">{edu}</span>,
        })), []);

    const currentAgeKey = useMemo(() => {
        if (!value.minAge && !value.maxAge) return 'all';
        if (value.minAge === '18' && value.maxAge === '25') return '18-25';
        if (value.minAge === '26' && value.maxAge === '32') return '26-32';
        if (value.minAge === '33' && value.maxAge === '40') return '33-40';
        if (value.minAge === '41' && (!value.maxAge || value.maxAge === '100')) return '41-plus';
        return 'custom';
    }, [value.minAge, value.maxAge]);

    const agePresetOptions: SelectOption[] = [
        {
            value: 'all',
            label: 'All Ages',
            description: 'Any age range',
            icon: (
                <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            ),
        },
        {
            value: '18-25',
            label: '18 – 25 years',
            description: 'Entry-level candidates',
            badge: <span className="age-preset-tag">Junior</span>,
        },
        {
            value: '26-32',
            label: '26 – 32 years',
            description: 'Mid-level candidates',
            badge: <span className="age-preset-tag">Mid-Level</span>,
        },
        {
            value: '33-40',
            label: '33 – 40 years',
            description: 'Senior professionals',
            badge: <span className="age-preset-tag">Senior</span>,
        },
        {
            value: '41-plus',
            label: '41+ years',
            description: 'Executive & lead roles',
            badge: <span className="age-preset-tag">Lead</span>,
        },
        {
            value: 'custom',
            label: 'Custom Range...',
            description: 'Specify custom minimum and maximum age',
            badge: <span className="custom-badge">Custom</span>,
        },
    ];

    const handleAgePresetChange = (presetKey: string) => {
        if (presetKey === 'all') {
            setShowCustomAge(false);
            onChange({ ...value, minAge: '', maxAge: '' });
        } else if (presetKey === '18-25') {
            setShowCustomAge(false);
            onChange({ ...value, minAge: '18', maxAge: '25' });
        } else if (presetKey === '26-32') {
            setShowCustomAge(false);
            onChange({ ...value, minAge: '26', maxAge: '32' });
        } else if (presetKey === '33-40') {
            setShowCustomAge(false);
            onChange({ ...value, minAge: '33', maxAge: '40' });
        } else if (presetKey === '41-plus') {
            setShowCustomAge(false);
            onChange({ ...value, minAge: '41', maxAge: '' });
        } else {
            setShowCustomAge(true);
        }
    };

    const currentCreatedKey = useMemo(() => {
        if (!value.createdFrom && !value.createdTo) return 'all';
        if (value.createdFrom === daysAgo(7) && value.createdTo === today) return 'last-7';
        if (value.createdFrom === daysAgo(30) && value.createdTo === today) return 'last-30';
        if (value.createdFrom === daysAgo(90) && value.createdTo === today) return 'last-90';
        if (value.createdFrom === startOfYear) return 'this-year';
        return 'custom';
    }, [value.createdFrom, value.createdTo, today]);

    const createdPresetOptions: SelectOption[] = [
        { value: 'all', label: 'All Time', description: 'No date constraints' },
        { value: 'last-7', label: 'Past 7 Days', description: 'Created recently this week' },
        { value: 'last-30', label: 'Past 30 Days', description: 'Created in the last month' },
        { value: 'last-90', label: 'Past 90 Days', description: 'Created in the last quarter' },
        { value: 'this-year', label: 'This Year (2026)', description: `From ${startOfYear} to today` },
        { value: 'custom', label: 'Custom Date Range...', description: 'Pick start and end date' },
    ];

    const handleCreatedPresetChange = (key: string) => {
        if (key === 'all') {
            setShowCustomCreated(false);
            onChange({ ...value, createdFrom: '', createdTo: '' });
        } else if (key === 'last-7') {
            setShowCustomCreated(false);
            onChange({ ...value, createdFrom: daysAgo(7), createdTo: today });
        } else if (key === 'last-30') {
            setShowCustomCreated(false);
            onChange({ ...value, createdFrom: daysAgo(30), createdTo: today });
        } else if (key === 'last-90') {
            setShowCustomCreated(false);
            onChange({ ...value, createdFrom: daysAgo(90), createdTo: today });
        } else if (key === 'this-year') {
            setShowCustomCreated(false);
            onChange({ ...value, createdFrom: startOfYear, createdTo: today });
        } else {
            setShowCustomCreated(true);
        }
    };

    const currentLoginKey = useMemo(() => {
        if (!value.lastLoginFrom && !value.lastLoginTo) return 'all';
        if (value.lastLoginFrom === daysAgo(1) && value.lastLoginTo === today) return 'last-24h';
        if (value.lastLoginFrom === daysAgo(7) && value.lastLoginTo === today) return 'last-7';
        if (value.lastLoginFrom === daysAgo(30) && value.lastLoginTo === today) return 'last-30';
        return 'custom';
    }, [value.lastLoginFrom, value.lastLoginTo, today]);

    const loginPresetOptions: SelectOption[] = [
        { value: 'all', label: 'All Activity', description: 'No activity constraints' },
        { value: 'last-24h', label: 'Active in Last 24h', description: 'Logged in within yesterday' },
        { value: 'last-7', label: 'Active in Last 7 Days', description: 'Active this past week' },
        { value: 'last-30', label: 'Active in Last 30 Days', description: 'Active this past month' },
        { value: 'custom', label: 'Custom Activity Range...', description: 'Select specific login dates' },
    ];

    const handleLoginPresetChange = (key: string) => {
        if (key === 'all') {
            setShowCustomLogin(false);
            onChange({ ...value, lastLoginFrom: '', lastLoginTo: '' });
        } else if (key === 'last-24h') {
            setShowCustomLogin(false);
            onChange({ ...value, lastLoginFrom: daysAgo(1), lastLoginTo: today });
        } else if (key === 'last-7') {
            setShowCustomLogin(false);
            onChange({ ...value, lastLoginFrom: daysAgo(7), lastLoginTo: today });
        } else if (key === 'last-30') {
            setShowCustomLogin(false);
            onChange({ ...value, lastLoginFrom: daysAgo(30), lastLoginTo: today });
        } else {
            setShowCustomLogin(true);
        }
    };

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
                    <div className="filter-icon-badge">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                    </div>
                    <div>
                        <div className="filter-title-row">
                            <h2>Filter Candidates</h2>
                            {activeFilterCount > 0 && (
                                <span className="badge badge-active">{activeFilterCount} active criteria</span>
                            )}
                        </div>
                        <p className="filter-subtitle">Select dropdown filters to pinpoint matching profiles</p>
                    </div>
                </div>
            </div>

            <div className="filter-grid">
                <div className="field-group">
                    <label className="field-label" htmlFor="filter-location-select">
                        Location
                    </label>
                    <CustomSelect
                        id="filter-location-select"
                        value={value.location}
                        onChange={(loc) => set('location', loc)}
                        options={locationOptions}
                        placeholder="All Locations"
                        disabled={disabled}
                    />
                </div>

                <div className="field-group">
                    <label className="field-label" htmlFor="filter-gender-select">
                        Gender
                    </label>
                    <CustomSelect
                        id="filter-gender-select"
                        value={value.gender}
                        onChange={(g) => set('gender', g)}
                        options={genderOptions}
                        placeholder="All Genders"
                        disabled={disabled}
                    />
                </div>

                <div className="field-group">
                    <label className="field-label" htmlFor="filter-education-select">
                        Education Qualification
                    </label>
                    <MultiSelectDropdown
                        id="filter-education-select"
                        values={value.education}
                        onChange={(edus) => set('education', edus)}
                        options={educationOptions}
                        placeholder="All Qualifications"
                        disabled={disabled}
                    />
                </div>

                <div className="field-group">
                    <div className="field-label-row">
                        <label className="field-label">Age Range</label>
                        {showCustomAge && (
                            <button
                                type="button"
                                className="link-button"
                                onClick={() => {
                                    setShowCustomAge(false);
                                    onChange({ ...value, minAge: '', maxAge: '' });
                                }}
                            >
                                Use presets
                            </button>
                        )}
                    </div>
                    <CustomSelect
                        value={currentAgeKey}
                        onChange={handleAgePresetChange}
                        options={agePresetOptions}
                        placeholder="All Ages"
                        disabled={disabled}
                    />
                    {(showCustomAge || currentAgeKey === 'custom') && (
                        <div className="custom-input-tray range-inputs">
                            <input
                                type="number"
                                min={0}
                                max={120}
                                placeholder="Min Age"
                                value={value.minAge}
                                onChange={(e) => set('minAge', e.target.value)}
                                aria-label="Minimum age"
                            />
                            <span className="range-divider">to</span>
                            <input
                                type="number"
                                min={0}
                                max={120}
                                placeholder="Max Age"
                                value={value.maxAge}
                                onChange={(e) => set('maxAge', e.target.value)}
                                aria-label="Maximum age"
                            />
                            <span className="unit-label">yrs</span>
                        </div>
                    )}
                </div>

                <div className="field-group">
                    <div className="field-label-row">
                        <label className="field-label">Created Date</label>
                        {showCustomCreated && (
                            <button
                                type="button"
                                className="link-button"
                                onClick={() => {
                                    setShowCustomCreated(false);
                                    onChange({ ...value, createdFrom: '', createdTo: '' });
                                }}
                            >
                                Use presets
                            </button>
                        )}
                    </div>
                    <CustomSelect
                        value={currentCreatedKey}
                        onChange={handleCreatedPresetChange}
                        options={createdPresetOptions}
                        placeholder="All Time"
                        disabled={disabled}
                    />
                    {(showCustomCreated || currentCreatedKey === 'custom') && (
                        <div className="custom-input-tray range-inputs">
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
                    )}
                </div>

                <div className="field-group">
                    <div className="field-label-row">
                        <label className="field-label">Last Login</label>
                        {showCustomLogin && (
                            <button
                                type="button"
                                className="link-button"
                                onClick={() => {
                                    setShowCustomLogin(false);
                                    onChange({ ...value, lastLoginFrom: '', lastLoginTo: '' });
                                }}
                            >
                                Use presets
                            </button>
                        )}
                    </div>
                    <CustomSelect
                        value={currentLoginKey}
                        onChange={handleLoginPresetChange}
                        options={loginPresetOptions}
                        placeholder="All Activity"
                        disabled={disabled}
                    />
                    {(showCustomLogin || currentLoginKey === 'custom') && (
                        <div className="custom-input-tray range-inputs">
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
                    )}
                </div>
            </div>

            <div className="filter-actions">
                <div className="filter-status-text">
                    {activeFilterCount > 0 ? (
                        <span>Filtering with <strong>{activeFilterCount}</strong> active parameter{activeFilterCount === 1 ? '' : 's'}</span>
                    ) : (
                        <span>No filters active (browsing all candidates in database)</span>
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