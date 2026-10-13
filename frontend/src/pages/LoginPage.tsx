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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
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
        <main className="login-page">
            <form className="card" onSubmit={handleSubmit}>
                <h1>Candidate Search</h1>
                <p className="subtitle">{isRegister ? 'Create an account to search candidates' : 'Sign in to access candidate search'}</p>

                <div className="tab-group" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                        type="button"
                        className={!isRegister ? '' : 'secondary'}
                        onClick={() => { setIsRegister(false); setError(null); }}
                        style={{ flex: 1 }}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={isRegister ? '' : 'secondary'}
                        onClick={() => { setIsRegister(true); setError(null); }}
                        style={{ flex: 1 }}
                    >
                        Register
                    </button>
                </div>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                    />
                </label>

                {isRegister && (
                    <small style={{ color: 'var(--text-muted, #888)', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.5rem', display: 'block' }}>
                        Must be at least 8 chars with an uppercase, lowercase, number, and special character.
                    </small>
                )}

                {error && <p role="alert" className="error">{error}</p>}
                {successMessage && <p role="status" className="status" style={{ color: '#22c55e' }}>{successMessage}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Register & Sign In' : 'Login')}
                </button>
            </form>
        </main>
    );
}