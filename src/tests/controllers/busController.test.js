import { jest } from '@jest/globals';
import { getBuses, getBusById, createBus, updateBusLocation, updateBus, deleteBus } from '../../controllers/busController.js';
import { Bus, Route } from '../../models/index.js';

// Mock the models
jest.mock('../../models/index.js', () => ({
  Bus: {
    findAll: jest.fn(),
    count: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Route: {},
}));

describe('Bus Controller', () => {
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

  describe('getBuses', () => {
    it('should return buses with default pagination', async () => {
      const mockBuses = [{ id: 1, busId: 'B001' }];
      Bus.findAll.mockResolvedValue(mockBuses);
      Bus.count.mockResolvedValue(1);

      await getBuses(req, res);

      expect(Bus.findAll).toHaveBeenCalledWith({
        where: {},
        include: [{ model: Route, as: 'Route' }],
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });
      expect(res.json).toHaveBeenCalledWith({
        buses: mockBuses,
        totalPages: 1,
        currentPage: 1,
        totalCount: 1,
        filters: {
          applied: false,
          routeId: undefined,
          status: undefined,
          operatorName: undefined,
          capacityRange: null,
          hasLocation: undefined,
        },
      });
    });

    it('should apply filters correctly', async () => {
      req.query = {
        routeId: '1',
        status: 'on-trip',
        operatorName: 'ABC',
        capacityMin: '20',
        capacityMax: '50',
        hasLocation: 'true',
        page: '2',
        limit: '5',
        sortBy: 'busId',
        sortOrder: 'ASC',
      };
      const mockBuses = [];
      Bus.findAll.mockResolvedValue(mockBuses);
      Bus.count.mockResolvedValue(0);

      await getBuses(req, res);

      expect(Bus.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.any(Object),
        include: [{ model: Route, as: 'Route' }],
        limit: 5,
        offset: 5,
        order: [['busId', 'ASC']],
      }));
    });

    it('should handle errors', async () => {
      Bus.findAll.mockRejectedValue(new Error('Database error'));

      await getBuses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getBusById', () => {
    it('should return bus if found', async () => {
      const mockBus = { id: 1, busId: 'B001' };
      Bus.findByPk.mockResolvedValue(mockBus);
      req.params.id = '1';

      await getBusById(req, res);

      expect(Bus.findByPk).toHaveBeenCalledWith('1', {
        include: [{ model: Route, as: 'Route' }],
      });
      expect(res.json).toHaveBeenCalledWith(mockBus);
    });

    it('should return 404 if bus not found', async () => {
      Bus.findByPk.mockResolvedValue(null);
      req.params.id = '1';

      await getBusById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bus not found' });
    });
  });

  describe('createBus', () => {
    it('should create a new bus', async () => {
      const mockBus = { id: 1, busId: 'B001' };
      Bus.create.mockResolvedValue(mockBus);
      req.body = { busId: 'B001', registrationNo: 'REG001', operatorName: 'Op1', capacity: 50, routeId: 1 };

      await createBus(req, res);

      expect(Bus.create).toHaveBeenCalledWith({
        busId: 'B001',
        registrationNo: 'REG001',
        operatorName: 'Op1',
        capacity: 50,
        routeId: 1,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBus);
    });
  });

  describe('updateBusLocation', () => {
    it('should update bus location', async () => {
      const mockBus = { id: 1, save: jest.fn() };
      Bus.findByPk.mockResolvedValue(mockBus);
      req.params.id = '1';
      req.body = { lat: 10.0, lng: 20.0, timestamp: '2023-01-01T00:00:00Z' };

      await updateBusLocation(req, res);

      expect(mockBus.currentLocation).toEqual({ lat: 10.0, lng: 20.0, timestamp: '2023-01-01T00:00:00Z' });
      expect(mockBus.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockBus);
    });

    it('should return 404 if bus not found', async () => {
      Bus.findByPk.mockResolvedValue(null);
      req.params.id = '1';

      await updateBusLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bus not found' });
    });
  });

  describe('updateBus', () => {
    it('should update bus details', async () => {
      const mockBus = { id: 1, update: jest.fn() };
      Bus.findByPk.mockResolvedValue(mockBus);
      req.params.id = '1';
      req.body = { registrationNo: 'NEWREG', operatorName: 'NewOp', capacity: 60, routeId: 2, status: 'maintenance' };

      await updateBus(req, res);

      expect(mockBus.update).toHaveBeenCalledWith({
        registrationNo: 'NEWREG',
        operatorName: 'NewOp',
        capacity: 60,
        routeId: 2,
        status: 'maintenance',
      });
      expect(res.json).toHaveBeenCalledWith(mockBus);
    });
  });

  describe('deleteBus', () => {
    it('should delete bus', async () => {
      const mockBus = { id: 1, destroy: jest.fn() };
      Bus.findByPk.mockResolvedValue(mockBus);
      req.params.id = '1';

      await deleteBus(req, res);

      expect(mockBus.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Bus deleted successfully' });
    });
  });
});