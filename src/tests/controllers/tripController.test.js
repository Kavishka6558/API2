import { jest } from '@jest/globals';
import { getTrips, getTripById, createTrip, updateTrip, deleteTrip } from '../../controllers/tripController.js';
import { Trip } from '../../models/index.js';

// Mock the models
jest.mock('../../models/index.js', () => ({
  Trip: {
    findAll: jest.fn(),
    count: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Route: {},
  Bus: {},
}));

describe('Trip Controller', () => {
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

  describe('getTrips', () => {
    it('should return trips with default pagination', async () => {
      const mockTrips = [{ id: 1, tripId: 'T001' }];
      Trip.findAll.mockResolvedValue(mockTrips);
      Trip.count.mockResolvedValue(1);

      await getTrips(req, res);

      expect(Trip.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getTripById', () => {
    it('should return trip if found', async () => {
      const mockTrip = { id: 1, tripId: 'T001' };
      Trip.findByPk.mockResolvedValue(mockTrip);
      req.params.id = '1';

      await getTripById(req, res);

      expect(Trip.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(mockTrip);
    });

    it('should return 404 if trip not found', async () => {
      Trip.findByPk.mockResolvedValue(null);
      req.params.id = '1';

      await getTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Trip not found' });
    });
  });

  describe('createTrip', () => {
    it('should create a new trip', async () => {
      const mockTrip = { id: 1, tripId: 'T001' };
      Trip.create.mockResolvedValue(mockTrip);
      req.body = { tripId: 'T001', routeId: 1, busId: 1, departureTime: '2023-01-01T10:00:00Z', arrivalTime: '2023-01-01T12:00:00Z', date: '2023-01-01' };

      await createTrip(req, res);

      expect(Trip.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTrip);
    });
  });

  describe('updateTrip', () => {
    it('should update trip', async () => {
      const mockTrip = { id: 1, update: jest.fn() };
      Trip.findByPk.mockResolvedValue(mockTrip);
      req.params.id = '1';
      req.body = { status: 'completed' };

      await updateTrip(req, res);

      expect(mockTrip.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockTrip);
    });
  });

  describe('deleteTrip', () => {
    it('should delete trip', async () => {
      const mockTrip = { id: 1, destroy: jest.fn() };
      Trip.findByPk.mockResolvedValue(mockTrip);
      req.params.id = '1';

      await deleteTrip(req, res);

      expect(mockTrip.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Trip deleted successfully' });
    });
  });
});