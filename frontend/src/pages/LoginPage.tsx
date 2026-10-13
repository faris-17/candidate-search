import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { tokenStorage } from '../auth/tokenStorage';
import { getErrorMessage } from '../utils/errors';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isRegister) {
                await register(email, password);
                // Automatically log in after registration
                const { token } = await login(email, password);
                tokenStorage.set(token);
                navigate('/search', { replace: true });
            } else {
                const { token } = await login(email, password);
                tokenStorage.set(token);
                navigate('/search', { replace: true });
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card card">
                <div className="auth-brand">
                    <div className="auth-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <circle cx="11" cy="11" r="3" />
                        </svg>
                    </div>
                    <h1>Candidate Search</h1>
                    <p className="auth-desc">
                        {isRegister
                            ? 'Create an account to query and manage candidate profiles'
                            : 'Sign in to access candidate directory, search, and analytics'}
                    </p>
                </div>

                <div className="segmented-tabs" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={!isRegister}
                        className={`tab-btn ${!isRegister ? 'tab-active' : ''}`}
                        onClick={() => { setIsRegister(false); setError(null); }}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={isRegister}
                        className={`tab-btn ${isRegister ? 'tab-active' : ''}`}
                        onClick={() => { setIsRegister(true); setError(null); }}
                    >
                        Register
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label className="field-label" htmlFor="auth-email">
                            Email Address
                        </label>
                        <div className="input-with-icon">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                id="auth-email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="auth-password">
                            Password
                        </label>
                        <div className="input-with-icon">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="auth-password"
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                            />
                        </div>
                    </div>

                    {isRegister && (
                        <div className="password-hint">
                            <svg className="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <span>Must be 8+ characters with uppercase, lowercase, number, and special character.</span>
                        </div>
                    )}

                    {error && (
                        <div className="form-error" role="alert">
                            <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="btn-spinner"></span>
                                {isRegister ? 'Creating Account...' : 'Signing In...'}
                            </>
                        ) : (
                            isRegister ? 'Create Account & Continue' : 'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Demo Account: <code>user1@example.com</code> / <code>Password@123</code></span>
                </div>
            </div>
        </div>
    );
}