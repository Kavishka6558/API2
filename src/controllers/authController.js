import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const register = async (req, res) => {
  const { username, password, role } = req.body;

  // Check if user is authenticated and is admin, or if this is the first user (allow creating first admin)
  const totalUsers = await User.count();
  const isFirstUser = totalUsers === 0;

  if (!isFirstUser) {
    // For subsequent registrations, require admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword, role });
  res.status(201).json({ message: 'User created', user: { id: user.id, username: user.username, role: user.role } });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
};