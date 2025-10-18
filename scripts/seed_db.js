#!/usr/bin/env node

/**
 * scripts/seed_db.js
 * - Reads src/data/seed.json and inserts records into the database
 * - Uses Sequelize models and DATABASE_URL env var
 * - Safe: uses findOrCreate to avoid duplicates
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env if present
dotenv.config();

import sequelize, { connectDB } from '../src/config/db.js';
import { Route, Bus, Trip } from '../src/models/index.js';

const seedPath = path.resolve(process.cwd(), 'src', 'data', 'seed.json');

async function run() {
  try {
    const raw = fs.readFileSync(seedPath, 'utf8');
    const seed = JSON.parse(raw);

    await connectDB();

    // Seed routes
    const routeMap = new Map(); // code -> route instance
    if (Array.isArray(seed.routes)) {
      for (const r of seed.routes) {
        const [route] = await Route.findOrCreate({
          where: { code: r.code },
          defaults: {
            name: r.name,
            origin: r.origin,
            destination: r.destination,
            stops: r.stops,
            distanceKm: r.distanceKm,
            estimatedDurationMin: r.estimatedDurationMin,
          },
        });
        routeMap.set(r.code, route);
        console.log(`Route: ${r.code} -> id ${route.id}`);
      }
    }

    // Seed buses
    const busMap = new Map(); // busId -> bus instance
    if (Array.isArray(seed.buses)) {
      for (const b of seed.buses) {
        const route = routeMap.get(b.routeCode);
        if (!route) {
          console.warn(`Skipping bus ${b.busId}: route ${b.routeCode} not found`);
          continue;
        }
        const [bus] = await Bus.findOrCreate({
          where: { busId: b.busId },
          defaults: {
            registrationNo: b.registrationNo,
            operatorName: b.operatorName,
            capacity: b.capacity,
            routeId: route.id,
          },
        });
        busMap.set(b.busId, bus);
        console.log(`Bus: ${b.busId} -> id ${bus.id}`);
      }
    }

    // Seed trips
    if (Array.isArray(seed.trips)) {
      for (const t of seed.trips) {
        const route = routeMap.get(t.routeCode);
        const bus = busMap.get(t.busId);
        if (!route) {
          console.warn(`Skipping trip ${t.tripId}: route ${t.routeCode} not found`);
          continue;
        }
        if (!bus) {
          console.warn(`Skipping trip ${t.tripId}: bus ${t.busId} not found`);
          continue;
        }

        const [trip] = await Trip.findOrCreate({
          where: { tripId: t.tripId },
          defaults: {
            routeId: route.id,
            busId: bus.id,
            departureTime: t.departureTime,
            arrivalTime: t.arrivalTime,
            date: t.date,
          },
        });
        console.log(`Trip: ${t.tripId} -> id ${trip.id}`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
