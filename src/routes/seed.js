import express from 'express';
import { seedDatabase } from '../controllers/seedController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin'), seedDatabase);

export default router;