import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../../middleware/auth.js';
import { User } from '../../models/index.js';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../models/index.js', () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const mockUser = { id: 1, role: 'admin' };
      req.header.mockReturnValue('Bearer valid_token');
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'test_secret');
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(req.user).toBe(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should reject missing token', async () => {
      req.header.mockReturnValue(undefined);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      req.header.mockReturnValue('Bearer invalid_token');
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });
  });

  describe('authorize', () => {
    it('should authorize user with correct role', () => {
      req.user = { role: 'admin' };
      const middleware = authorize('admin', 'bus_operator');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject user with incorrect role', () => {
      req.user = { role: 'commuter' };
      const middleware = authorize('admin', 'bus_operator');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});