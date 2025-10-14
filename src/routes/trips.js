import express from 'express';
import { getTrips, getTripById, createTrip, updateTrip, deleteTrip } from '../controllers/tripController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public read operations (all authenticated users)
router.get('/', authenticate, authorize('admin', 'bus_operator', 'commuter'), getTrips);
router.get('/:id', authenticate, authorize('admin', 'bus_operator', 'commuter'), getTripById);

// Admin-only CRUD operations
router.post('/', authenticate, authorize('admin'), createTrip);
router.put('/:id', authenticate, authorize('admin'), updateTrip);
router.delete('/:id', authenticate, authorize('admin'), deleteTrip);

export default router;