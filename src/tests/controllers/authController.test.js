import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { register, login } from '../../controllers/authController.js';
import { User } from '../../models/index.js';

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models/index.js', () => ({
  User: {
    count: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('register', () => {
    it('should register first admin user', async () => {
      User.count.mockResolvedValue(0);
      bcrypt.hash.mockResolvedValue('hashed_password');
      User.create.mockResolvedValue({ id: 1, username: 'admin', role: 'admin' });

      req.body = { username: 'admin', password: 'pass', role: 'admin' };

      await register(req, res);

      expect(User.count).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(User.create).toHaveBeenCalledWith({ username: 'admin', password: 'hashed_password', role: 'admin' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created',
        user: { id: 1, username: 'admin', role: 'admin' },
      });
    });

    it('should require admin token for subsequent registrations', async () => {
      User.count.mockResolvedValue(1);
      req.headers.authorization = '';

      req.body = { username: 'user', password: 'pass', role: 'commuter' };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    });

    it('should allow admin to create users', async () => {
      User.count.mockResolvedValue(1);
      jwt.verify.mockReturnValue({ role: 'admin' });
      bcrypt.hash.mockResolvedValue('hashed_password');
      User.create.mockResolvedValue({ id: 2, username: 'user', role: 'commuter' });

      req.headers.authorization = 'Bearer valid_token';
      req.body = { username: 'user', password: 'pass', role: 'commuter' };

      await register(req, res);

      expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'test_secret');
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = { id: 1, username: 'user', password: 'hashed', role: 'commuter' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      req.body = { username: 'user', password: 'pass' };

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'user' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('pass', 'hashed');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, role: 'commuter' }, 'test_secret');
      expect(res.json).toHaveBeenCalledWith({ token: 'token123' });
    });

    it('should reject invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      req.body = { username: 'user', password: 'wrong' };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});