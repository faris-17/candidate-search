import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface MultiOption {
    value: string;
    label: string;
    badge?: ReactNode;
}

interface Props {
    values: string[];
    onChange: (values: string[]) => void;
    options: MultiOption[];
    placeholder?: string;
    id?: string;
    disabled?: boolean;
    className?: string;
}

export default function MultiSelectDropdown({
    values,
    onChange,
    options,
    placeholder = 'All Qualifications',
    id,
    disabled = false,
    className = '',
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const toggleOption = (val: string) => {
        if (values.includes(val)) {
            onChange(values.filter((v) => v !== val));
        } else {
            onChange([...values, val]);
        }
    };

    const selectAll = () => {
        onChange(options.map((o) => o.value));
    };

    const clearAll = () => {
        onChange([]);
    };

    return (
        <div
            ref={dropdownRef}
            className={`custom-select-container multi-select-container ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
        >
            <button
                type="button"
                id={id}
                className="custom-select-trigger"
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="trigger-content">
                    {values.length === 0 ? (
                        <span className="trigger-placeholder">{placeholder}</span>
                    ) : values.length === 1 ? (
                        <div className="trigger-pill-group">
                            <span className="trigger-pill">{values[0]}</span>
                        </div>
                    ) : (
                        <div className="trigger-pill-group">
                            <span className="trigger-pill">{values[0]}</span>
                            <span className="trigger-more-badge">+{values.length - 1} more</span>
                        </div>
                    )}
                </div>
                <div className="trigger-meta">
                    {values.length > 0 && (
                        <span className="badge badge-active">{values.length} selected</span>
                    )}
                    <svg
                        className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="custom-select-menu multi-menu">
                    <div className="multi-header">
                        <span className="multi-title">Select Qualifications</span>
                        <div className="multi-actions">
                            <button
                                type="button"
                                className="multi-action-btn"
                                onClick={selectAll}
                                disabled={values.length === options.length}
                            >
                                Select All
                            </button>
                            <span className="multi-action-divider">•</span>
                            <button
                                type="button"
                                className="multi-action-btn"
                                onClick={clearAll}
                                disabled={values.length === 0}
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <ul className="multi-options-list" role="listbox" tabIndex={-1}>
                        {options.map((opt) => {
                            const isChecked = values.includes(opt.value);
                            return (
                                <li
                                    key={opt.value}
                                    role="option"
                                    aria-selected={isChecked}
                                    className={`custom-select-option multi-option ${isChecked ? 'is-selected' : ''}`}
                                    onClick={() => toggleOption(opt.value)}
                                >
                                    <div className="option-main">
                                        <div className="option-left">
                                            <input
                                                type="checkbox"
                                                className="multi-checkbox"
                                                checked={isChecked}
                                                readOnly
                                                tabIndex={-1}
                                            />
                                            <span className="option-label">{opt.label}</span>
                                        </div>
                                        <div className="option-right">
                                            {opt.badge && <span className="option-badge">{opt.badge}</span>}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
