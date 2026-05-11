import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', domain: 'civil' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/auth/register`, form);
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        {/* Left Hero */}
        <div className="auth-hero">
          <div className="auth-hero-icon">🏛️</div>
          <h2>Join KanoonConnect</h2>
          <p>Register as a client seeking legal help or as a lawyer offering your expertise to those in need.</p>
          <div className="auth-features">
            {[
              
            ].map((f, i) => (
              <div key={i} className="auth-feature-item">
                <div className="auth-feature-dot" style={{ background: i < 2 ? '#38bdf8' : '#4ade80' }} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="auth-form-side">
          <h3>Create Account</h3>
          <p className="subtitle">Fill in your details below</p>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">✓ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>I am a…</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">Client (User)</option>
                <option value="lawyer">Lawyer</option>
              </select>
            </div>
            {form.role === 'lawyer' && (
              <div className="form-group">
                <label>Specialisation Domain</label>
                <select name="domain" value={form.domain} onChange={handleChange}>
                  <option value="civil">Civil</option>
                  <option value="criminal">Criminal</option>
                  <option value="family">Family</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
            )}
            <button type="submit" className="btn btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? <><span className="spinner" style={{ marginRight: 8 }} />Creating account…</> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
