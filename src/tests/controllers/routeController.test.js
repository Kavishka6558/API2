import { jest } from '@jest/globals';
import { getRoutes, getRouteById, createRoute, updateRoute, deleteRoute } from '../../controllers/routeController.js';
import { Route, Trip, Bus } from '../../models/index.js';

// Mock the models
jest.mock('../../models/index.js', () => ({
  Route: {
    findAll: jest.fn(),
    count: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Trip: {
    findAll: jest.fn(),
  },
  Bus: {},
}));

describe('Route Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getRoutes', () => {
    it('should return routes with default pagination', async () => {
      const mockRoutes = [{ id: 1, code: 'R001' }];
      Route.findAll.mockResolvedValue(mockRoutes);
      Route.count.mockResolvedValue(1);

      await getRoutes(req, res);

      expect(Route.findAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getRouteById', () => {
    it('should return route if found', async () => {
      const mockRoute = { id: 1, code: 'R001' };
      Route.findByPk.mockResolvedValue(mockRoute);
      Trip.findAll.mockResolvedValue([]);
      req.params.id = '1';

      await getRouteById(req, res);

      expect(Route.findByPk).toHaveBeenCalledWith('1');
      expect(Trip.findAll).toHaveBeenCalledWith({
        where: { routeId: '1' },
        include: [{ model: Bus, as: 'Bus' }],
      });
      expect(res.json).toHaveBeenCalledWith({ route: mockRoute, trips: [] });
    });

    it('should return 404 if route not found', async () => {
      Route.findByPk.mockResolvedValue(null);
      req.params.id = '1';

      await getRouteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Route not found' });
    });
  });

  describe('createRoute', () => {
    it('should create a new route', async () => {
      const mockRoute = { id: 1, code: 'R001' };
      Route.create.mockResolvedValue(mockRoute);
      req.body = { code: 'R001', name: 'Route 1', origin: 'A', destination: 'B', stops: [], distanceKm: 100, estimatedDurationMin: 120 };

      await createRoute(req, res);

      expect(Route.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRoute);
    });
  });

  describe('updateRoute', () => {
    it('should update route', async () => {
      const mockRoute = { id: 1, update: jest.fn() };
      Route.findByPk.mockResolvedValue(mockRoute);
      req.params.id = '1';
      req.body = { name: 'Updated Route' };

      await updateRoute(req, res);

      expect(mockRoute.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockRoute);
    });
  });

  describe('deleteRoute', () => {
    it('should delete route', async () => {
      const mockRoute = { id: 1, destroy: jest.fn() };
      Route.findByPk.mockResolvedValue(mockRoute);
      req.params.id = '1';

      await deleteRoute(req, res);

      expect(mockRoute.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Route deleted successfully' });
    });
  });
});