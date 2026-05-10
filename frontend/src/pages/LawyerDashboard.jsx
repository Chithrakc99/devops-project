import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LawyerDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [dates, setDates] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!user || user.role !== 'lawyer') { navigate('/login'); return; }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API}/api/appointments/${user.id}/lawyer`);
      setAppointments(res.data);
    } catch (e) { /* silent */ }
  };

  const updateStatus = async (id, status) => {
    const payload = { status };
    if (status === 'accepted') {
      if (!quotes[id] || !dates[id]) {
        alert('Please enter BOTH a Quote Price and an Appointment Date before accepting.');
        return;
      }
      payload.quotePrice = quotes[id];
      payload.appointmentDate = dates[id];
    }
    try {
      await axios.put(`${API}/api/appointments/${id}/status`, payload);
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

  const tabs = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'pending', label: 'Pending', icon: '⏳' },
    { key: 'accepted', label: 'Accepted', icon: '✅' },
    { key: 'rejected', label: 'Closed', icon: '🗃️' },
  ];

  const filtered = activeTab === 'all' ? appointments
    : activeTab === 'rejected' ? appointments.filter(a => a.status === 'rejected' || a.status === 'cancelled')
    : appointments.filter(a => a.status === activeTab);

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="theme-lawyer container">
      {/* Navbar */}
      <div className="nav">
        <div className="nav-brand">
          <div className="nav-brand-icon" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>⚖️</div>
          <div>
            <h2 style={{ margin: 0 }}>
              {user.name}
              <span className="nav-role-badge">Lawyer</span>
            </h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={fetchAppointments}>🔄 Refresh</button>
          <button className="btn btn-danger btn-sm" onClick={logout}>Sign Out</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',    value: appointments.length,                                  color: '#a8b4f5' },
          { label: 'Pending',  value: appointments.filter(a=>a.status==='pending').length,  color: '#fbbf24' },
          { label: 'Accepted', value: appointments.filter(a=>a.status==='accepted').length, color: '#4ade80' },
          { label: 'Closed',   value: appointments.filter(a=>['rejected','cancelled'].includes(a.status)).length, color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign:'center', padding:'1rem', marginBottom:0 }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {pendingCount > 0 && (
        <div style={{ background: 'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)', borderRadius:'var(--radius-sm)', padding:'0.65rem 1rem', marginBottom:'1.25rem', fontSize:'0.875rem', color:'#fbbf24', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          ⏳ You have <strong>{pendingCount}</strong> pending appointment{pendingCount > 1 ? 's' : ''} awaiting your response.
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar">
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.icon} <span>{t.label}</span>
            {t.key === 'pending' && pendingCount > 0 && (
              <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '10px', padding: '0 6px', fontSize: '0.75rem' }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Appointments */}
      <div className="card">
        <h3>Appointment Requests</h3>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No appointments in this category.</p>
          </div>
        ) : (
          filtered.map(a => (
            <div key={a._id} className="appointment-item">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.5rem' }}>
                <div>
                  <strong style={{ fontSize:'0.95rem', color:'var(--text-primary)' }}>{a.userId?.name}</strong>
                  <span style={{ marginLeft:'0.5rem', fontSize:'0.8rem', color:'var(--text-secondary)' }}>{a.userId?.email}</span>
                </div>
                <span className={`status-badge status-${a.status}`}>{a.status.toUpperCase()}</span>
              </div>

              <p style={{ marginTop:'0.5rem', background:'var(--bg-input)', padding:'0.5rem 0.75rem', borderRadius:'var(--radius-sm)', fontSize:'0.875rem', color:'var(--text-secondary)' }}>
                💬 {a.description}
              </p>

              {a.appointmentDate && (
                <p>📅 <strong>Date & Time:</strong> {new Date(a.appointmentDate).toLocaleString()}</p>
              )}
              {a.quotePrice !== null && (
                <p>💰 <strong>Quoted Price:</strong> ₹{a.quotePrice}</p>
              )}

              {a.status === 'pending' && (
                <div>
                  <div className="apt-inputs">
                    <input
                      type="number"
                      placeholder="Quote Price (₹)"
                      min="0"
                      onChange={(e) => setQuotes({ ...quotes, [a._id]: e.target.value })}
                    />
                    <input
                      type="datetime-local"
                      onChange={(e) => setDates({ ...dates, [a._id]: e.target.value })}
                    />
                  </div>
                  <div className="apt-actions">
                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(a._id, 'accepted')}>✓ Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a._id, 'rejected')}>✕ Reject</button>
                  </div>
                </div>
              )}

              {a.status === 'accepted' && (
                <div className="apt-actions">
                  <button className="btn btn-warning btn-sm" onClick={() => updateStatus(a._id, 'cancelled')}>Cancel Appointment</button>
                </div>
              )}

              {a.status === 'cancelled' && (
                <div className="apt-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => deleteAppointment(a._id)}>🗑 Delete Record</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LawyerDashboard;
