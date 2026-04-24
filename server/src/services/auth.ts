import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../collections/user';
import { HTTP_STATUS } from '../utils/httpStatus';

const BCRYPT_ROUNDS = 10;

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return secret;
}

function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, jwtSecret(), { expiresIn: '7d' });
}

export class AuthService {
  async register(email: string, password: string): Promise<{ token: string; email: string }> {
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      const err = Object.assign(new Error('Email already registered'), { statusCode: HTTP_STATUS.CONFLICT });
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await User.create({ email, passwordHash });

    return { token: signToken(user._id.toString(), user.email), email: user.email };
  }

  async login(email: string, password: string): Promise<{ token: string; email: string }> {
    const user = await User.findOne({ email }).lean();
    const invalid = !user || !(await bcrypt.compare(password, user.passwordHash));
    if (invalid) {
      const err = Object.assign(new Error('Invalid email or password'), { statusCode: HTTP_STATUS.UNAUTHORIZED });
      throw err;
    }

    return { token: signToken(user._id.toString(), user.email), email: user.email };
  }
}
