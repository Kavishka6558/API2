import { Bus, Route } from '../models/index.js';
import { Op } from 'sequelize';

// Get all buses with optional filters
export const getBuses = async (req, res) => {
  try {
    const {
      routeId,
      status,
      operatorName,
      capacityMin,
      capacityMax,
      hasLocation,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const where = {};

    // Basic filters
    if (routeId) where.routeId = routeId;
    if (status) where.status = status;
    if (operatorName) where.operatorName = { [Op.iLike]: `%${operatorName}%` };

    // Capacity range filter
    if (capacityMin || capacityMax) {
      where.capacity = {};
      if (capacityMin) where.capacity[Op.gte] = parseInt(capacityMin);
      if (capacityMax) where.capacity[Op.lte] = parseInt(capacityMax);
    }

    // Location filter
    if (hasLocation === 'true') {
      where.currentLocation = { [Op.ne]: null };
    } else if (hasLocation === 'false') {
      where.currentLocation = null;
    }

    const buses = await Bus.findAll({
      where,
      include: [{ model: Route, as: 'Route' }],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    const count = await Bus.count({ where });
    res.json({
      buses,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCount: count,
      filters: {
        applied: Object.keys(where).length > 0,
        routeId,
        status,
        operatorName,
        capacityRange: capacityMin || capacityMax ? { min: capacityMin, max: capacityMax } : null,
        hasLocation
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bus by ID
export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id, {
      include: [{ model: Route, as: 'Route' }],
    });
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create bus
export const createBus = async (req, res) => {
  try {
    const { busId, registrationNo, operatorName, capacity, routeId } = req.body;
    const bus = await Bus.create({ busId, registrationNo, operatorName, capacity, routeId });
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update bus location
export const updateBusLocation = async (req, res) => {
  try {
    const { lat, lng, timestamp } = req.body;
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    bus.currentLocation = { lat, lng, timestamp: timestamp || new Date() };
    await bus.save();
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update bus
export const updateBus = async (req, res) => {
  try {
    const { registrationNo, operatorName, capacity, routeId, status } = req.body;
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    await bus.update({ registrationNo, operatorName, capacity, routeId, status });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete bus
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    await bus.destroy();
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};