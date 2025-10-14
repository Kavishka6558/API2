import { jest } from '@jest/globals';
import { getBusLocation, getRouteLocations } from '../../controllers/trackingController.js';
import { Bus } from '../../models/index.js';

// Mock the models
jest.mock('../../models/index.js', () => ({
  Bus: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    findByPk: jest.fn(),
  },
  Route: {},
}));

describe('Tracking Controller', () => {
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

  describe('getBusLocation', () => {
    it('should return bus location if found', async () => {
      const mockBus = {
        busId: 'B001',
        currentLocation: { lat: 10, lng: 20 },
        status: 'on-trip',
        updatedAt: new Date(),
      };
      Bus.findOne.mockResolvedValue(mockBus);
      req.params.busId = 'B001';

      await getBusLocation(req, res);

      expect(Bus.findOne).toHaveBeenCalledWith({ where: { busId: 'B001' } });
      expect(res.json).toHaveBeenCalledWith({
        busId: 'B001',
        currentLocation: { lat: 10, lng: 20 },
        status: 'on-trip',
        lastUpdated: mockBus.updatedAt,
      });
    });

    it('should return 404 if bus not found', async () => {
      Bus.findOne.mockResolvedValue(null);
      req.params.busId = 'B001';

      await getBusLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bus not found' });
    });
  });

  describe('getRouteLocations', () => {
    it('should return route locations', async () => {
      const mockBuses = [{ id: 1, busId: 'B001' }];
      Bus.findAll.mockResolvedValue(mockBuses);
      Bus.count.mockResolvedValue(1);
      req.params.routeId = '1';

      await getRouteLocations(req, res);

      expect(Bus.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });
});