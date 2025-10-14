import request from 'supertest';
import app from '../app.js';
import Bus from '../models/Bus.js';

describe('Bus API', () => {
  beforeEach(async () => {
    await Bus.destroy({ where: {} });
  });

  it('should get all buses', async () => {
    const res = await request(app).get('/api/buses');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('buses');
  });

  it('should update bus location', async () => {
    const bus = new Bus({
      busId: 'TEST001',
      registrationNo: 'TEST-001',
      operatorName: 'Test Operator',
      capacity: 50,
      routeId: '507f1f77bcf86cd799439011', // dummy ObjectId
    });
    await bus.save();

    const res = await request(app)
      .post(`/api/buses/${bus._id}/location`)
      .send({ lat: 6.9271, lng: 79.8612 });
    expect(res.statusCode).toEqual(200);
  });
});