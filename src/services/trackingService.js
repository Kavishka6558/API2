// Service to simulate GPS updates for buses
// This could be used in a background job or cron

import Bus from '../models/Bus.js';

export const simulateLocationUpdate = async (busId, lat, lng) => {
  try {
    const bus = await Bus.findOne({ busId });
    if (!bus) throw new Error('Bus not found');

    bus.currentLocation = { lat, lng, timestamp: new Date() };
    await bus.save();
    return bus;
  } catch (error) {
    throw error;
  }
};

// Example: Simulate random movement for a bus
export const simulateRandomMovement = async (busId) => {
  const lat = 6.9271 + (Math.random() - 0.5) * 0.1; // Around Colombo
  const lng = 79.8612 + (Math.random() - 0.5) * 0.1;
  return await simulateLocationUpdate(busId, lat, lng);
};