import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Route, Bus, Trip } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
    await sequelize.sync();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedDB = async () => {
  try {
    const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/seed.json'), 'utf-8'));

    await Trip.destroy({ where: {} });
    await Bus.destroy({ where: {} });
    await Route.destroy({ where: {} });

    const routes = await Route.bulkCreate(seedData.routes);
    const routeMap = {};
    routes.forEach(route => {
      routeMap[route.code] = route.id;
    });

    const busesData = seedData.buses.map(bus => ({
      ...bus,
      routeId: routeMap[bus.routeCode],
    }));
    const buses = await Bus.bulkCreate(busesData);

    const busMap = {};
    buses.forEach(bus => {
      busMap[bus.busId] = bus.id;
    });

    const tripsData = seedData.trips.map(trip => ({
      ...trip,
      routeId: routeMap[trip.routeCode],
      busId: busMap[trip.busId],
    }));
    await Trip.bulkCreate(tripsData);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error(error);
  } finally {
    sequelize.close();
  }
};

connectDB().then(() => seedDB());