import { Route, Trip, Bus } from '../models/index.js';
import { Op } from 'sequelize';

// Get all routes with pagination
export const getRoutes = async (req, res) => {
  try {
    const {
      origin,
      destination,
      distanceMin,
      distanceMax,
      durationMin,
      durationMax,
      code,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const where = {};

    // Location filters
    if (origin) where.origin = { [Op.iLike]: `%${origin}%` };
    if (destination) where.destination = { [Op.iLike]: `%${destination}%` };
    if (code) where.code = { [Op.iLike]: `%${code}%` };

    // Distance range filter
    if (distanceMin || distanceMax) {
      where.distanceKm = {};
      if (distanceMin) where.distanceKm[Op.gte] = parseInt(distanceMin);
      if (distanceMax) where.distanceKm[Op.lte] = parseInt(distanceMax);
    }

    // Duration range filter
    if (durationMin || durationMax) {
      where.estimatedDurationMin = {};
      if (durationMin) where.estimatedDurationMin[Op.gte] = parseInt(durationMin);
      if (durationMax) where.estimatedDurationMin[Op.lte] = parseInt(durationMax);
    }

    const routes = await Route.findAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    const count = await Route.count({ where });
    res.json({
      routes,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCount: count,
      filters: {
        applied: Object.keys(where).length > 0,
        origin,
        destination,
        code,
        distanceRange: distanceMin || distanceMax ? { min: distanceMin, max: distanceMax } : null,
        durationRange: durationMin || durationMax ? { min: durationMin, max: durationMax } : null
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get route by ID with scheduled trips
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    const trips = await Trip.findAll({
      where: { routeId: req.params.id },
      include: [{ model: Bus, as: 'Bus' }],
    });
    res.json({ route, trips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create route
export const createRoute = async (req, res) => {
  try {
    const { code, name, origin, destination, stops, distanceKm, estimatedDurationMin } = req.body;
    const route = await Route.create({ code, name, origin, destination, stops, distanceKm, estimatedDurationMin });
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update route
export const updateRoute = async (req, res) => {
  try {
    const { code, name, origin, destination, stops, distanceKm, estimatedDurationMin } = req.body;
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    await route.update({ code, name, origin, destination, stops, distanceKm, estimatedDurationMin });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete route
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    await route.destroy();
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};