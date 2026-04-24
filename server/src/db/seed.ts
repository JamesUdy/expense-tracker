import bcrypt from 'bcrypt';
import { User } from '../collections/user';
import { Expense } from '../collections/expense';
import { toCents } from '../utils/money';
import logger from '../lib/logger';

const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'demo1234';

const SEED_EXPENSES: Array<{
  amount: number;
  category: string;
  description: string;
  date: string;
}> = [
  { amount: 850,   category: 'Food',          description: 'Swiggy — biryani dinner',         date: '2026-04-23' },
  { amount: 120,   category: 'Transport',      description: 'Ola ride to office',              date: '2026-04-23' },
  { amount: 3200,  category: 'Shopping',       description: 'Cotton linen shirt — Myntra',     date: '2026-04-22' },
  { amount: 650,   category: 'Food',           description: 'Lunch with team — Adyar Ananda', date: '2026-04-22' },
  { amount: 499,   category: 'Entertainment',  description: 'Netflix monthly subscription',    date: '2026-04-21' },
  { amount: 2100,  category: 'Health',         description: 'Gym membership renewal',          date: '2026-04-20' },
  { amount: 340,   category: 'Food',           description: 'Zomato breakfast — idli set',     date: '2026-04-20' },
  { amount: 180,   category: 'Transport',      description: 'Metro card top-up',               date: '2026-04-19' },
  { amount: 5500,  category: 'Shopping',       description: 'Running shoes — Decathlon',       date: '2026-04-18' },
  { amount: 220,   category: 'Food',           description: 'Chai & snacks — office canteen',  date: '2026-04-18' },
  { amount: 1200,  category: 'Health',         description: 'Blood test + vitamin D panel',    date: '2026-04-17' },
  { amount: 799,   category: 'Entertainment',  description: 'Spotify Premium + Audible',       date: '2026-04-16' },
  { amount: 460,   category: 'Transport',      description: 'Rapido bike rides — weekly',      date: '2026-04-15' },
  { amount: 1850,  category: 'Food',           description: 'Weekend dinner — The Fatty Bao',  date: '2026-04-14' },
  { amount: 650,   category: 'Other',          description: 'Birthday gift — colleague',       date: '2026-04-13' },
  { amount: 4200,  category: 'Shopping',       description: 'Noise earbuds — Amazon sale',     date: '2026-04-12' },
  { amount: 290,   category: 'Food',           description: 'Grocery run — local kirana',      date: '2026-04-11' },
  { amount: 900,   category: 'Transport',      description: 'Cab to airport — drop',           date: '2026-04-10' },
  { amount: 350,   category: 'Entertainment',  description: 'Movie tickets — IMAX',            date: '2026-04-09' },
  { amount: 6800,  category: 'Health',         description: 'Annual dental cleaning',          date: '2026-04-08' },
  { amount: 780,   category: 'Food',           description: 'Home cook grocery order — BB',    date: '2026-04-07' },
  { amount: 1100,  category: 'Other',          description: 'Mobile recharge — annual pack',   date: '2026-04-06' },
  { amount: 2400,  category: 'Shopping',       description: 'Books — Notion Press + Amazon',   date: '2026-04-05' },
  { amount: 560,   category: 'Food',           description: 'Brunch — Smoke & Barrel',         date: '2026-04-04' },
  { amount: 250,   category: 'Transport',      description: 'Parking fee — Phoenix Mall',      date: '2026-04-03' },
  { amount: 1500,  category: 'Entertainment',  description: 'Stand-up comedy show tickets',    date: '2026-04-02' },
  { amount: 430,   category: 'Food',           description: 'Swiggy Instamart — fruits & veg', date: '2026-04-01' },
  { amount: 3700,  category: 'Shopping',       description: 'Formal trousers — Westside',      date: '2026-03-30' },
  { amount: 980,   category: 'Health',         description: 'Physio session — shoulder pain',  date: '2026-03-28' },
  { amount: 320,   category: 'Other',          description: 'Newspaper + magazine subs',       date: '2026-03-25' },
];

export async function seedDemoAccount(): Promise<void> {
  const existing = await User.findOne({ email: DEMO_EMAIL }).lean();
  if (existing) return;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await User.create({ email: DEMO_EMAIL, passwordHash });
  const userId = user._id.toString();

  const docs = SEED_EXPENSES.map((e, i) => ({
    userId,
    amount: toCents(e.amount),
    category: e.category,
    description: e.description,
    date: e.date,
    idempotency_key: `demo-seed-${i}`,
  }));

  await Expense.insertMany(docs);
  logger.info('Demo account seeded', { email: DEMO_EMAIL, expenses: docs.length });
}
