import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

process.env.NODE_ENV = 'test';

let mongod: MongoMemoryServer;

import { app } from '../src/app';

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

const validExpense = {
  amount: 12.5,
  category: 'Food',
  description: 'Lunch',
  date: '2024-04-01',
};

describe('POST /expenses', () => {
  it('creates a new expense and returns 201', async () => {
    const res = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', crypto.randomUUID())
      .send(validExpense);

    expect(res.status).toBe(201);
    expect(res.body.category).toBe('Food');
    expect(res.body.amount).toBe(1250);
    expect(res.body.date).toBe('2024-04-01');
  });

  it('returns 200 with same expense on duplicate idempotency key', async () => {
    const key = crypto.randomUUID();

    const first = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', key)
      .send(validExpense);

    const second = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', key)
      .send(validExpense);

    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect(second.body._id).toBe(first.body._id);
  });

  it('returns 400 when Idempotency-Key header is missing', async () => {
    const res = await request(app).post('/expenses').send(validExpense);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Idempotency-Key header is required');
  });

  it('returns 400 when amount is negative', async () => {
    const res = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ ...validExpense, amount: -10 });

    expect(res.status).toBe(400);
    expect(res.body.error.amount).toBeDefined();
  });

  it('returns 400 when date format is invalid', async () => {
    const res = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ ...validExpense, date: '01-04-2024' });

    expect(res.status).toBe(400);
    expect(res.body.error.date).toBeDefined();
  });

  it('returns 400 when category is empty', async () => {
    const res = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ ...validExpense, category: '' });

    expect(res.status).toBe(400);
    expect(res.body.error.category).toBeDefined();
  });
});

describe('GET /expenses', () => {
  beforeEach(async () => {
    await request(app)
      .post('/expenses')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ amount: 100, category: 'Food', description: 'Dinner', date: '2024-04-03' });

    await request(app)
      .post('/expenses')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ amount: 50, category: 'Transport', description: 'Bus', date: '2024-04-01' });

    await request(app)
      .post('/expenses')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ amount: 200, category: 'Food', description: 'Groceries', date: '2024-04-02' });
  });

  it('returns all expenses with total_cents', async () => {
    const res = await request(app).get('/expenses');
    expect(res.status).toBe(200);
    expect(res.body.expenses).toHaveLength(3);
    expect(res.body.total_cents).toBe(35000);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/expenses?category=Food');
    expect(res.status).toBe(200);
    expect(res.body.expenses).toHaveLength(2);
    expect(res.body.expenses.every((e: { category: string }) => e.category === 'Food')).toBe(true);
    expect(res.body.total_cents).toBe(30000);
  });

  it('sorts by date descending by default', async () => {
    const res = await request(app).get('/expenses');
    const dates = res.body.expenses.map((e: { date: string }) => e.date);
    expect(dates).toEqual(['2024-04-03', '2024-04-02', '2024-04-01']);
  });

  it('sorts by date ascending when sort=date_asc', async () => {
    const res = await request(app).get('/expenses?sort=date_asc');
    const dates = res.body.expenses.map((e: { date: string }) => e.date);
    expect(dates).toEqual(['2024-04-01', '2024-04-02', '2024-04-03']);
  });

  it('returns 400 for invalid sort value', async () => {
    const res = await request(app).get('/expenses?sort=invalid');
    expect(res.status).toBe(400);
  });
});
