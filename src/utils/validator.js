// Simple validation utilities

export const validateLocation = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  return true;
};

export const validateBusId = (busId) => {
  return typeof busId === 'string' && busId.length > 0;
};