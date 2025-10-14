import { Bus, Route } from '../models/index.js';
import { Op } from 'sequelize';

// Get current location for a bus
export const getBusLocation = async (req, res) => {
  try {
    const bus = await Bus.findOne({ where: { busId: req.params.busId } });
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json({
      busId: bus.busId,
      currentLocation: bus.currentLocation,
      status: bus.status,
      lastUpdated: bus.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all buses for a route with locations and filtering
export const getRouteLocations = async (req, res) => {
  try {
    const {
      status,
      hasLocation,
      operatorName,
      page = 1,
      limit = 50
    } = req.query;

    const where = { routeId: req.params.routeId };

    // Status filter
    if (status) where.status = status;

    // Location availability filter
    if (hasLocation === 'true') {
      where.currentLocation = { [Op.ne]: null };
    } else if (hasLocation === 'false') {
      where.currentLocation = null;
    }

    // Operator filter
    if (operatorName) where.operatorName = { [Op.iLike]: `%${operatorName}%` };

    const buses = await Bus.findAll({
      where,
      include: [{ model: Route, as: 'Route' }],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['updatedAt', 'DESC']],
    });

    const count = await Bus.count({ where });

    res.json({
      routeId: req.params.routeId,
      buses: buses.map(bus => ({
        busId: bus.busId,
        currentLocation: bus.currentLocation,
        status: bus.status,
        operatorName: bus.operatorName,
        lastUpdated: bus.updatedAt
      })),
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      filters: {
        applied: Object.keys(where).length > 1, // routeId is always present
        status,
        hasLocation,
        operatorName
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};