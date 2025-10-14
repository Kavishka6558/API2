import Trip from '../../models/Trip.js';

describe('Trip Model', () => {
  it('should define Trip model with correct attributes', () => {
    expect(Trip).toBeDefined();
    expect(Trip.name).toBe('Trip');
  });

  it('should have tripId as unique string', () => {
    const attributes = Trip.rawAttributes;
    expect(attributes.tripId.type.key).toBe('STRING');
    expect(attributes.tripId.allowNull).toBe(false);
    expect(attributes.tripId.unique).toBe(true);
  });

  it('should have routeId as required integer with reference', () => {
    const attributes = Trip.rawAttributes;
    expect(attributes.routeId.type.key).toBe('INTEGER');
    expect(attributes.routeId.allowNull).toBe(false);
    expect(attributes.routeId.references.model).toBe('Routes');
  });

  it('should have busId as required integer with reference', () => {
    const attributes = Trip.rawAttributes;
    expect(attributes.busId.type.key).toBe('INTEGER');
    expect(attributes.busId.allowNull).toBe(false);
    expect(attributes.busId.references.model).toBe('Buses');
  });

  it('should have departureTime as required date', () => {
    const attributes = Trip.rawAttributes;
    expect(attributes.departureTime.type.key).toBe('DATE');
    expect(attributes.departureTime.allowNull).toBe(false);
  });

  it('should have arrivalTime as required date', () => {
    const attributes = Trip.rawAttributes;
    expect(attributes.arrivalTime.type.key).toBe('DATE');
    expect(attributes.arrivalTime.allowNull).toBe(false);
  });

  it('should have date as required dateonly', () => {
    const attributes = Trip.rawAttributes;
    expect(attributes.date.type.key).toBe('DATEONLY');
    expect(attributes.date.allowNull).toBe(false);
  });
});