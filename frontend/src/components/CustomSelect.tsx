import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface SelectOption {
    value: string;
    label: string;
    icon?: ReactNode;
    badge?: ReactNode;
    description?: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    id?: string;
    disabled?: boolean;
    className?: string;
    ariaLabel?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    id,
    disabled = false,
    className = '',
    ariaLabel,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close when clicking outside
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

    return (
        <div
            ref={dropdownRef}
            className={`custom-select-container ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
        >
            <button
                type="button"
                id={id}
                className="custom-select-trigger"
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={ariaLabel || placeholder}
            >
                <div className="trigger-content">
                    {selectedOption ? (
                        <>
                            {selectedOption.icon && <span className="trigger-icon">{selectedOption.icon}</span>}
                            <span className="trigger-label">{selectedOption.label}</span>
                            {selectedOption.badge && <span className="trigger-badge">{selectedOption.badge}</span>}
                        </>
                    ) : (
                        <span className="trigger-placeholder">{placeholder}</span>
                    )}
                </div>
                <svg
                    className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <ul className="custom-select-menu" role="listbox" tabIndex={-1}>
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <li
                                key={opt.value}
                                role="option"
                                aria-selected={isSelected}
                                className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="option-main">
                                    <div className="option-left">
                                        {opt.icon && <span className="option-icon">{opt.icon}</span>}
                                        <div className="option-text-group">
                                            <span className="option-label">{opt.label}</span>
                                            {opt.description && (
                                                <span className="option-desc">{opt.description}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="option-right">
                                        {opt.badge && <span className="option-badge">{opt.badge}</span>}
                                        {isSelected && (
                                            <svg
                                                className="option-check"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                aria-hidden="true"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
