import express from 'express';
import { getBusLocation, getRouteLocations } from '../controllers/trackingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/:busId', authenticate, authorize('admin', 'bus_operator', 'commuter'), getBusLocation);
router.get('/route/:routeId', authenticate, authorize('admin', 'bus_operator', 'commuter'), getRouteLocations);

export default router;