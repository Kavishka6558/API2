import express from 'express';
import { getBuses, getBusById, createBus, updateBus, deleteBus, updateBusLocation } from '../controllers/busController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public read operations (all authenticated users)
router.get('/', authenticate, authorize('admin', 'bus_operator', 'commuter'), getBuses);
router.get('/:id', authenticate, authorize('admin', 'bus_operator', 'commuter'), getBusById);

// Admin-only CRUD operations
router.post('/', authenticate, authorize('admin'), createBus);
router.put('/:id', authenticate, authorize('admin'), updateBus);
router.delete('/:id', authenticate, authorize('admin'), deleteBus);

// Location updates (admin and assigned bus operators)
router.post('/:id/location', authenticate, authorize('admin', 'bus_operator'), updateBusLocation);

export default router;