import { useState } from 'react';
import type { XtreamServerConfig } from '../types/xtream';
import './Login.css';

interface LoginProps {
  onLogin: (config: XtreamServerConfig) => void;
  savedConfig?: XtreamServerConfig | null;
}

export default function Login({ onLogin, savedConfig }: LoginProps) {
  const [baseUrl, setBaseUrl] = useState(savedConfig?.baseUrl || '');
  const [username, setUsername] = useState(savedConfig?.username || '');
  const [password, setPassword] = useState(savedConfig?.password || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config: XtreamServerConfig = {
        baseUrl: baseUrl.trim().replace(/\/$/, ''), // Remove trailing slash
        username: username.trim(),
        password: password.trim(),
      };

      await onLogin(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>IPTV Client</h1>
        <p className="subtitle">Connect to your Xtream Codes server</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="baseUrl">Server URL</label>
            <input
              id="baseUrl"
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://example.com:8080"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
}
