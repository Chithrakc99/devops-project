import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DOMAIN_COLORS = { criminal:'domain-criminal', civil:'domain-civil', family:'domain-family', corporate:'domain-corporate', none:'domain-none' };
const URGENCY_LABEL = { URGENT:'🔴 URGENT', HIGH:'🟠 HIGH', MEDIUM:'🟡 MEDIUM', LOW:'🟢 LOW' };

function SuggestionResult({ data, label }) {
  if (!data) return null;
  return (
    <div className="suggestion-result" style={{ marginBottom: label === 'Primary' ? '1rem' : 0 }}>
      <div className="suggestion-header">
        <h4>
          <span>⚖️</span>
          {label === 'Primary' ? data.title : `Also Relevant: ${data.title}`}
        </h4>
        <span className={`status-badge urgency-${data.urgency}`}>
          {URGENCY_LABEL[data.urgency] || data.urgency}
        </span>
      </div>
      <div className="suggestion-body">
        {data.emergency && (
          <div className="emergency-banner">
            🚨 EMERGENCY ALERT — Immediate legal action or safety measures may be required!
          </div>
        )}
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          Our Recommendation
        </p>
        <div className="recommendation-text">{data.recommendation}</div>
        <p style={{ margin: '0 0 0.6rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          Relevant Laws & Sections
        </p>
        <ul className="laws-list">
          {data.laws.map((law, i) => (
            <li key={i} className="law-item">
              <span className="law-section">{law.section}</span>
              <span className="law-desc">{law.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('suggestion');
  const [lawyers, setLawyers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bookingMsg, setBookingMsg] = useState('');
  const [description, setDescription] = useState('');
  const [situation, setSituation] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');

  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!user || user.role !== 'user') { navigate('/login'); return; }
    fetchLawyers();
    fetchAppointments();
  }, []);

  const fetchLawyers = async () => {
    try {
      const res = await axios.get(`${API}/api/appointments/lawyers`);
      setLawyers(res.data);
    } catch (e) { /* silent */ }
  };

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API}/api/appointments/${user.id}/user`);
      setAppointments(res.data);
    } catch (e) { /* silent */ }
  };

  const getSuggestion = async () => {
    if (!situation.trim() || situation.trim().length < 10) {
      setSuggestionError('Please describe your situation in at least 10 characters.');
      return;
    }
    setSuggestionLoading(true);
    setSuggestionError('');
    setSuggestion(null);
    try {
      const res = await axios.post(`${API}/api/suggestions`, { situation });
      setSuggestion(res.data);
    } catch (err) {
      setSuggestionError(err.response?.data?.msg || 'Error getting suggestion. Please try again.');
    } finally {
      setSuggestionLoading(false);
    }
  };

  const bookAppointment = async (lawyerId) => {
    if (!description.trim()) {
      setBookingMsg('Please describe your problem/situation before booking.');
      return;
    }
    try {
      await axios.post(`${API}/api/appointments/book`, { userId: user.id, lawyerId, description });
      setBookingMsg('✓ Appointment booked successfully!');
      setDescription('');
      fetchAppointments();
    } catch (err) {
      setBookingMsg(err.response?.data?.msg || 'Error booking appointment.');
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await axios.put(`${API}/api/appointments/${id}/status`, { status: 'cancelled' });
      fetchAppointments();
    } catch (e) { /* silent */ }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`${API}/api/appointments/${id}`);
      fetchAppointments();
    } catch (e) { /* silent */ }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  if (!user) return null;

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const acceptedCount = appointments.filter(a => a.status === 'accepted').length;

  return (
    <div className="theme-user container">
      {/* Navbar */}
      <div className="nav">
        <div className="nav-brand">
          <div className="nav-brand-icon">⚖️</div>
          <div>
            <h2 style={{ margin: 0 }}>
              {user.name}
              <span className="nav-role-badge">Client</span>
            </h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { fetchLawyers(); fetchAppointments(); }}>🔄 Refresh</button>
          <button className="btn btn-danger btn-sm" onClick={logout}>Sign Out</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Pending', value: pendingCount, color: '#fbbf24' },
          { label: 'Accepted', value: acceptedCount, color: '#34d399' },
          { label: 'Available Lawyers', value: lawyers.length, color: '#38bdf8' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1rem', marginBottom: 0 }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'suggestion' ? 'active' : ''}`} onClick={() => setActiveTab('suggestion')}>
          🤖 <span>Legal Suggestion</span>
        </button>
        <button className={`tab-btn ${activeTab === 'appointment' ? 'active' : ''}`} onClick={() => setActiveTab('appointment')}>
          📅 <span>Book Appointment</span>
        </button>
        <button className={`tab-btn ${activeTab === 'myapts' ? 'active' : ''}`} onClick={() => setActiveTab('myapts')}>
          📋 <span>My Appointments</span> {appointments.length > 0 && <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0 6px', fontSize: '0.75rem' }}>{appointments.length}</span>}
        </button>
      </div>

      {/* ── SUGGESTION TAB ── */}
      {activeTab === 'suggestion' && (
        <div className="card">
          <h3>🤖 AI-Powered Legal Suggestion</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
            Describe your legal situation in detail. Our system will analyse it against Indian laws and provide relevant legal information, applicable sections, and recommended actions.
          </p>
          <div className="form-group">
            <label>Describe Your Situation</label>
            <textarea
              rows="5"
              placeholder="e.g., My landlord is trying to evict me without any notice and changed the locks on my rented apartment in Bangalore. I have a registered rental agreement. What are my rights?"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              style={{ resize: 'vertical', minHeight: '110px' }}
            />
          </div>
          {suggestionError && <div className="error-msg">{suggestionError}</div>}
          <button className="btn" onClick={getSuggestion} disabled={suggestionLoading}>
            {suggestionLoading ? <><span className="spinner" style={{ marginRight: 8 }} />Analysing your situation…</> : '⚖️ Get Legal Suggestion'}
          </button>

          {suggestion && (
            <div style={{ marginTop: '1.5rem' }}>
              <SuggestionResult data={suggestion.primary} label="Primary" />
              {suggestion.secondary && (
                <div className="secondary-suggestion">
                  <h5>🔗 Additional Relevant Area:</h5>
                  <SuggestionResult data={suggestion.secondary} label="Secondary" />
                </div>
              )}
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--gold-dim)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(240,180,41,0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                ⚠️ <strong style={{ color: 'var(--gold)' }}>Disclaimer:</strong> This is AI-generated legal information based on Indian law. It does not constitute formal legal advice. Please consult a qualified lawyer for your specific case.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BOOK APPOINTMENT TAB ── */}
      {activeTab === 'appointment' && (
        <div className="card">
          <h3>📅 Book an Appointment</h3>
          <div className="form-group">
            <label>Describe Your Problem / Context</label>
            <textarea
              rows="3"
              placeholder="Briefly explain your legal issue so the lawyer can prepare..."
              value={description}
              onChange={(e) => { setDescription(e.target.value); setBookingMsg(''); }}
            />
          </div>
          {bookingMsg && (
            <div className={bookingMsg.startsWith('✓') ? 'success-msg' : 'error-msg'}>{bookingMsg}</div>
          )}
          <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Available Lawyers
          </h4>
          {lawyers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <p>No lawyers available yet. Check back later.</p>
            </div>
          ) : (
            <div className="lawyer-grid">
              {lawyers.map(l => (
                <div key={l._id} className="lawyer-card">
                  <div className="lawyer-info">
                    <strong>{l.name}</strong>
                    <div style={{ marginTop: '4px' }}>
                      <span className={`domain-badge ${DOMAIN_COLORS[l.domain] || 'domain-none'}`}>{l.domain}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>{l.email}</span>
                  </div>
                  <button className="btn btn-sm" onClick={() => bookAppointment(l._id)}>Book</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MY APPOINTMENTS TAB ── */}
      {activeTab === 'myapts' && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>📋 My Appointments</h3>
          </div>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No appointments yet. Book one from the Appointment tab.</p>
            </div>
          ) : (
            appointments.map(a => (
              <div key={a._id} className="appointment-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{a.lawyerId?.name}</strong>
                    <span style={{ marginLeft: '0.5rem' }}><span className={`domain-badge ${DOMAIN_COLORS[a.lawyerId?.domain]}`}>{a.lawyerId?.domain}</span></span>
                  </div>
                  <span className={`status-badge status-${a.status}`}>{a.status.toUpperCase()}</span>
                </div>
                <p style={{ marginTop: '0.5rem' }}><strong>Problem:</strong> {a.description}</p>
                {a.appointmentDate && <p>📅 <strong>Date:</strong> {new Date(a.appointmentDate).toLocaleString()}</p>}
                {a.quotePrice !== null && <p>💰 <strong>Quoted Price:</strong> ₹{a.quotePrice}</p>}
                <div className="apt-actions">
                  {(a.status === 'pending' || a.status === 'accepted') && (
                    <button className="btn btn-warning btn-sm" onClick={() => cancelAppointment(a._id)}>Cancel</button>
                  )}
                  {a.status === 'cancelled' && (
                    <button className="btn btn-danger btn-sm" onClick={() => deleteAppointment(a._id)}>Delete Record</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
