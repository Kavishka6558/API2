import request from 'supertest';
import app from '../app.js';
import Route from '../models/Route.js';

describe('Route API', () => {
  beforeEach(async () => {
    await Route.destroy({ where: {} });
  });

  it('should get all routes', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('routes');
  });
});