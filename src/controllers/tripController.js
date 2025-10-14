import { Trip, Route, Bus } from '../models/index.js';
import { Op } from 'sequelize';

// Get all trips with optional filters
export const getTrips = async (req, res) => {
  try {
    const {
      routeId,
      busId,
      date,
      dateFrom,
      dateTo,
      status,
      departureTimeFrom,
      departureTimeTo,
      page = 1,
      limit = 10,
      sortBy = 'departureTime',
      sortOrder = 'ASC'
    } = req.query;

    const where = {};

    // Basic filters
    if (routeId) where.routeId = routeId;
    if (busId) where.busId = busId;
    if (status) where.status = status;

    // Date filters
    if (date) {
      where.date = date;
    } else if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date[Op.gte] = dateFrom;
      if (dateTo) where.date[Op.lte] = dateTo;
    }

    // Time range filters
    if (departureTimeFrom || departureTimeTo) {
      where.departureTime = {};
      if (departureTimeFrom) where.departureTime[Op.gte] = departureTimeFrom;
      if (departureTimeTo) where.departureTime[Op.lte] = departureTimeTo;
    }

    const trips = await Trip.findAll({
      where,
      include: [
        { model: Route, as: 'Route' },
        { model: Bus, as: 'Bus' }
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    const count = await Trip.count({ where });
    res.json({
      trips,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCount: count,
      filters: {
        applied: Object.keys(where).length > 0,
        routeId,
        busId,
        date,
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : null,
        status,
        timeRange: departureTimeFrom || departureTimeTo ? { from: departureTimeFrom, to: departureTimeTo } : null
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trip by ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Route, as: 'Route' },
        { model: Bus, as: 'Bus' }
      ],
    });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create trip
export const createTrip = async (req, res) => {
  try {
    const { tripId, routeId, busId, departureTime, arrivalTime, date } = req.body;
    const trip = await Trip.create({ tripId, routeId, busId, departureTime, arrivalTime, date });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update trip
export const updateTrip = async (req, res) => {
  try {
    const { tripId, routeId, busId, departureTime, arrivalTime, date, status } = req.body;
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    await trip.update({ tripId, routeId, busId, departureTime, arrivalTime, date, status });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete trip
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    await trip.destroy();
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};