/**
 * Integration Tests — API Endpoints
 * Uses jest.mock for database models so no real MongoDB connection is needed.
 * Tests the full request → route handler → response pipeline.
 */

const request = require('supertest');

// ── Mock bcryptjs ────────────────────────────────────────────────────
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
  compare: jest.fn((plain, hashed) => Promise.resolve(plain === 'password123')),
  genSalt: jest.fn(() => Promise.resolve('salt')),
}));

// ── Mock jsonwebtoken ────────────────────────────────────────────────
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock_jwt_token'),
  verify: jest.fn(() => ({ id: 'user_id_123' })),
}));

// ── Mock mongoose connect ────────────────────────────────────────────
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn(() => Promise.resolve()),
    connection: { collections: {} },
  };
});

// Track users and appointments in-memory
const mockUsers = [];
const mockAppointments = [];

// ── Mock User model ──────────────────────────────────────────────────
jest.mock('../../models/User', () => {
  function MockUser(data) {
    Object.assign(this, data);
    this._id = 'user_' + Math.random().toString(36).slice(2);
  }
  MockUser.prototype.save = jest.fn(function () {
    mockUsers.push(this);
    return Promise.resolve(this);
  });
  MockUser.findOne = jest.fn(({ email } = {}) => {
    const user = mockUsers.find(u => u.email === email);
    return Promise.resolve(user || null);
  });
  MockUser.find = jest.fn(({ role } = {}) => {
    const result = mockUsers.filter(u => u.role === role);
    return {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn(() => Promise.resolve(result)),
      then: (res) => Promise.resolve(result).then(res),
      [Symbol.iterator]: function* () { yield* result; },
    };
  });
  return MockUser;
});

// ── Mock Appointment model ───────────────────────────────────────────
jest.mock('../../models/Appointment', () => {
  function MockAppointment(data) {
    Object.assign(this, data);
    this._id = 'apt_' + Math.random().toString(36).slice(2);
    this.status = 'pending';
    this.quotePrice = null;
    this.appointmentDate = null;
  }
  MockAppointment.prototype.save = jest.fn(function () {
    mockAppointments.push(this);
    return Promise.resolve(this);
  });
  MockAppointment.findOne = jest.fn(({ userId, lawyerId, status } = {}) => {
    const apt = mockAppointments.find(a =>
      (!userId || String(a.userId) === String(userId)) &&
      (!lawyerId || String(a.lawyerId) === String(lawyerId)) &&
      (!status || (Array.isArray(status.$in) ? status.$in.includes(a.status) : a.status === status))
    );
    return Promise.resolve(apt || null);
  });
  MockAppointment.find = jest.fn(({ userId, lawyerId } = {}) => {
    const results = mockAppointments.filter(a =>
      (!userId || String(a.userId) === String(userId)) &&
      (!lawyerId || String(a.lawyerId) === String(lawyerId))
    );
    const chain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn(() => Promise.resolve(results)),
      then: (onFulfilled) => Promise.resolve(results).then(onFulfilled),
    };
    return chain;
  });
  MockAppointment.findByIdAndUpdate = jest.fn((id, update) => {
    const apt = mockAppointments.find(a => a._id === id);
    if (apt) Object.assign(apt, update.$set || update);
    return Promise.resolve(apt);
  });
  MockAppointment.findByIdAndDelete = jest.fn((id) => {
    const idx = mockAppointments.findIndex(a => a._id === id);
    if (idx !== -1) mockAppointments.splice(idx, 1);
    return Promise.resolve(true);
  });
  return MockAppointment;
});

// Load app after all mocks are in place
const app = require('../../server');

// Clear in-memory stores between tests
beforeEach(() => {
  mockUsers.length = 0;
  mockAppointments.length = 0;
});

// ─── Health Check ────────────────────────────────────────────────────
describe('Health Check', () => {
  test('GET /health returns 200 with status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body).toHaveProperty('timestamp');
  });
});

// ─── Auth – Register ─────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  test('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user' });

    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe('User registered successfully');
  });

  test('registers a new lawyer with domain', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test Lawyer', email: 'lawyer@example.com', password: 'password123', role: 'lawyer', domain: 'criminal' });

    expect(res.statusCode).toBe(201);
  });

  test('rejects duplicate email', async () => {
    // Pre-populate a user in mock store
    const User = require('../../models/User');
    User.findOne.mockResolvedValueOnce({ email: 'dup@example.com', role: 'user' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Another', email: 'dup@example.com', password: 'pass', role: 'user' });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('User already exists');
  });

  test('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nope@example.com' });

    expect(res.statusCode).toBe(400);
  });
});

// ─── Auth – Login ────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  beforeEach(() => {
    const User = require('../../models/User');
    User.findOne.mockResolvedValue({
      _id: 'user123',
      name: 'Test User',
      email: 'user@example.com',
      password: 'hashed_password',
      role: 'user',
    });
  });

  test('logs in successfully and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.role).toBe('user');
  });

  test('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Invalid credentials');
  });

  test('rejects non-existent email', async () => {
    const User = require('../../models/User');
    User.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'pass' });

    expect(res.statusCode).toBe(400);
  });
});

// ─── Suggestions API ─────────────────────────────────────────────────
describe('POST /api/suggestions', () => {
  test('returns structured suggestion for valid situation', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({ situation: 'I was arrested by the police and kept in jail without being told why' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('primary');
    expect(res.body.primary).toHaveProperty('title');
    expect(res.body.primary).toHaveProperty('category');
    expect(res.body.primary).toHaveProperty('urgency');
    expect(res.body.primary).toHaveProperty('recommendation');
    expect(Array.isArray(res.body.primary.laws)).toBe(true);
    expect(res.body.primary).toHaveProperty('emergency');
  });

  test('returns 400 for empty situation', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({ situation: '' });
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 when situation is too short', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({ situation: 'help' });
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 when situation field is missing', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('returns URGENT urgency for domestic violence scenario', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({ situation: 'My husband is beating me and abusing me at home with domestic violence' });

    expect(res.statusCode).toBe(200);
    expect(res.body.primary.urgency).toBe('URGENT');
    expect(res.body.primary.emergency).toBe(true);
  });

  test('returns laws array with section and description', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({ situation: 'I want to file for divorce from my spouse by mutual consent' });

    expect(res.statusCode).toBe(200);
    expect(res.body.primary.laws.length).toBeGreaterThan(0);
    expect(res.body.primary.laws[0]).toHaveProperty('section');
    expect(res.body.primary.laws[0]).toHaveProperty('description');
  });

  test('may return secondary match for multi-issue situations', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({ situation: 'I was arrested by police and also want to file for divorce' });

    expect(res.statusCode).toBe(200);
    expect(res.body.primary).toBeDefined();
    if (res.body.secondary) {
      expect(res.body.secondary).toHaveProperty('title');
      expect(res.body.secondary).toHaveProperty('recommendation');
    }
  });

  test('always returns a primary result for unknown situations', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({ situation: 'I have a very unusual legal situation that I need help with today' });

    expect(res.statusCode).toBe(200);
    expect(res.body.primary).toBeDefined();
    expect(res.body.primary.recommendation).toBeTruthy();
  });

  test('returns URGENT and emergency true for arrest scenario', async () => {
    const res = await request(app)
      .post('/api/suggestions')
      .send({ situation: 'Police have arrested me and detained me in the police station lockup' });

    expect(res.statusCode).toBe(200);
    expect(res.body.primary.urgency).toBe('URGENT');
    expect(res.body.primary.emergency).toBe(true);
  });
});

// ─── Appointments – Get Lawyers ───────────────────────────────────────
describe('GET /api/appointments/lawyers', () => {
  test('returns list of registered lawyers', async () => {
    const User = require('../../models/User');
    const mockLawyers = [
      { _id: 'l1', name: 'Advocate Sharma', email: 'sharma@law.com', role: 'lawyer', domain: 'criminal' },
      { _id: 'l2', name: 'Advocate Patel', email: 'patel@law.com', role: 'lawyer', domain: 'civil' },
    ];
    User.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn(() => Promise.resolve(mockLawyers)),
      then: (res) => Promise.resolve(mockLawyers).then(res),
    });

    const res = await request(app).get('/api/appointments/lawyers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─── Appointments – Book ──────────────────────────────────────────────
describe('POST /api/appointments/book', () => {
  test('books an appointment successfully', async () => {
    const Appointment = require('../../models/Appointment');
    Appointment.findOne.mockResolvedValueOnce(null); // no existing booking

    const res = await request(app)
      .post('/api/appointments/book')
      .send({ userId: 'u1', lawyerId: 'l1', description: 'Need help with my criminal case' });

    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe('Appointment booked successfully');
  });

  test('rejects duplicate active appointments', async () => {
    const Appointment = require('../../models/Appointment');
    Appointment.findOne.mockResolvedValueOnce({ _id: 'existing', status: 'pending' });

    const res = await request(app)
      .post('/api/appointments/book')
      .send({ userId: 'u1', lawyerId: 'l1', description: 'Duplicate booking' });

    expect(res.statusCode).toBe(400);
  });
});

// ─── Appointments – View by User/Lawyer ──────────────────────────────
describe('GET /api/appointments/:userId/:role', () => {
  test('returns user appointments by userId', async () => {
    const Appointment = require('../../models/Appointment');
    const mockApts = [
      { _id: 'a1', userId: 'u1', lawyerId: { name: 'Sharma', email: 'sharma@law.com', domain: 'criminal' }, description: 'Help needed', status: 'pending' },
    ];
    Appointment.find.mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn(() => Promise.resolve(mockApts)),
    });

    const res = await request(app).get('/api/appointments/u1/user');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('returns lawyer appointments by lawyerId', async () => {
    const Appointment = require('../../models/Appointment');
    Appointment.find.mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn(() => Promise.resolve([])),
    });

    const res = await request(app).get('/api/appointments/l1/lawyer');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─── Appointments – Update Status ────────────────────────────────────
describe('PUT /api/appointments/:id/status', () => {
  test('updates appointment status to accepted with quote', async () => {
    const Appointment = require('../../models/Appointment');
    const mockApt = { _id: 'a1', status: 'accepted', quotePrice: 5000, appointmentDate: new Date().toISOString() };
    Appointment.findByIdAndUpdate.mockResolvedValueOnce(mockApt);

    const res = await request(app)
      .put('/api/appointments/a1/status')
      .send({ status: 'accepted', quotePrice: 5000, appointmentDate: new Date().toISOString() });

    expect(res.statusCode).toBe(200);
  });

  test('updates appointment status to rejected', async () => {
    const Appointment = require('../../models/Appointment');
    Appointment.findByIdAndUpdate.mockResolvedValueOnce({ _id: 'a1', status: 'rejected' });

    const res = await request(app)
      .put('/api/appointments/a1/status')
      .send({ status: 'rejected' });

    expect(res.statusCode).toBe(200);
  });
});
