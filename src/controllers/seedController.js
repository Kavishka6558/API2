import fs from 'fs';
import path from 'path';
import { Route, Bus, Trip, User } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const seedDatabase = async (req, res) => {
  try {

    const seedData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'seed.json'), 'utf-8'));

    // Clear existing data
    await Trip.destroy({ where: {} });
    await Bus.destroy({ where: {} });
    await Route.destroy({ where: {} });
    
    // Check if users exist, only seed if no users
    const userCount = await User.count();
    if (userCount === 0) {
      await User.destroy({ where: {} });
      
      // Seed users
      const hashedAdmin = await bcrypt.hash('admin123', 10);
      const hashedOperator = await bcrypt.hash('operator123', 10);
      const hashedCommuter = await bcrypt.hash('commuter123', 10);
      await User.bulkCreate([
        { username: 'admin', password: hashedAdmin, role: 'admin' },
        { username: 'operator', password: hashedOperator, role: 'bus_operator' },
        { username: 'commuter', password: hashedCommuter, role: 'commuter' },
      ]);
    }

    // Insert routes
    const routes = await Route.bulkCreate(seedData.routes);

    // Create route map for buses
    const routeMap = {};
    routes.forEach(route => {
      routeMap[route.code] = route.id;
    });

    // Insert buses
    const busesData = seedData.buses.map(bus => ({
      ...bus,
      routeId: routeMap[bus.routeCode],
    }));
    const buses = await Bus.bulkCreate(busesData);

    // Create bus map for trips
    const busMap = {};
    buses.forEach(bus => {
      busMap[bus.busId] = bus.id;
    });

    // Insert trips
    const tripsData = seedData.trips.map(trip => ({
      ...trip,
      routeId: routeMap[trip.routeCode],
      busId: busMap[trip.busId],
    }));
    await Trip.bulkCreate(tripsData);

    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};