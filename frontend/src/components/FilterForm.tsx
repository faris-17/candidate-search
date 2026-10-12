import { EDUCATION_OPTIONS, GENDER_OPTIONS } from '../constants';
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
        set('education',
            value.education.includes(option)
                ? value.education.filter((e) => e !== option)
                : [...value.education, option]);

    return (
        <form className="filters card" onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
            <fieldset>
                <legend>Age</legend>
                <input type="number" min={0} max={120} placeholder="Min" value={value.minAge}
                    onChange={(e) => set('minAge', e.target.value)} aria-label="Minimum age" />
                <span> – </span>
                <input type="number" min={0} max={120} placeholder="Max" value={value.maxAge}
                    onChange={(e) => set('maxAge', e.target.value)} aria-label="Maximum age" />
            </fieldset>

            <label>
                Gender
                <select value={value.gender} onChange={(e) => set('gender', e.target.value)}>
                    <option value="">Any</option>
                    {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
            </label>

            <label>
                Location
                <input type="text" placeholder="e.g. Kochi" value={value.location}
                    onChange={(e) => set('location', e.target.value)} />
            </label>

            <fieldset>
                <legend>Education</legend>
                {EDUCATION_OPTIONS.map((option) => (
                    <label key={option} className="checkbox">
                        <input type="checkbox" checked={value.education.includes(option)}
                            onChange={() => toggleEducation(option)} />
                        {option}
                    </label>
                ))}
            </fieldset>

            <fieldset>
                <legend>Created date</legend>
                <input type="date" value={value.createdFrom} onChange={(e) => set('createdFrom', e.target.value)} aria-label="Created from" />
                <span> – </span>
                <input type="date" value={value.createdTo} onChange={(e) => set('createdTo', e.target.value)} aria-label="Created to" />
            </fieldset>

            <fieldset>
                <legend>Last login</legend>
                <input type="date" value={value.lastLoginFrom} onChange={(e) => set('lastLoginFrom', e.target.value)} aria-label="Last login from" />
                <span> – </span>
                <input type="date" value={value.lastLoginTo} onChange={(e) => set('lastLoginTo', e.target.value)} aria-label="Last login to" />
            </fieldset>

            <div className="actions">
                <button type="submit" disabled={disabled}>Search</button>
                <button type="button" className="secondary" onClick={onReset} disabled={disabled}>Reset</button>
            </div>
        </form>
    );
}