import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { tokenStorage } from '../auth/tokenStorage';
import { getErrorMessage } from '../utils/errors';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();                 // stop the browser's full-page form submit
        setLoading(true);
        setError(null);
        try {
            const { token } = await login(email, password);
            tokenStorage.set(token);
            navigate('/search', { replace: true });
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

                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required autoComplete="email" />
                </label>

                <label>
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required autoComplete="current-password" />
                </label>

                {error && <p role="alert" className="error">{error}</p>}

                <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
            </form>
        </main>
    );
}