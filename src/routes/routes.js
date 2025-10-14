import express from 'express';
import { getRoutes, getRouteById, createRoute, updateRoute, deleteRoute } from '../controllers/routeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public read operations (all authenticated users)
router.get('/', authenticate, authorize('admin', 'bus_operator', 'commuter'), getRoutes);
router.get('/:id', authenticate, authorize('admin', 'bus_operator', 'commuter'), getRouteById);

// Admin-only CRUD operations
router.post('/', authenticate, authorize('admin'), createRoute);
router.put('/:id', authenticate, authorize('admin'), updateRoute);
router.delete('/:id', authenticate, authorize('admin'), deleteRoute);

export default router;