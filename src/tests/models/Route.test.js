import Route from '../../models/Route.js';

describe('Route Model', () => {
  it('should define Route model with correct attributes', () => {
    expect(Route).toBeDefined();
    expect(Route.name).toBe('Route');
  });

  it('should have code as unique string', () => {
    const attributes = Route.rawAttributes;
    expect(attributes.code.type.key).toBe('STRING');
    expect(attributes.code.allowNull).toBe(false);
    expect(attributes.code.unique).toBe(true);
  });

  it('should have name as required string', () => {
    const attributes = Route.rawAttributes;
    expect(attributes.name.type.key).toBe('STRING');
    expect(attributes.name.allowNull).toBe(false);
  });

  it('should have origin as required string', () => {
    const attributes = Route.rawAttributes;
    expect(attributes.origin.type.key).toBe('STRING');
    expect(attributes.origin.allowNull).toBe(false);
  });

  it('should have destination as required string', () => {
    const attributes = Route.rawAttributes;
    expect(attributes.destination.type.key).toBe('STRING');
    expect(attributes.destination.allowNull).toBe(false);
  });

  it('should have stops as required JSON', () => {
    const attributes = Route.rawAttributes;
    expect(attributes.stops.type.key).toBe('JSON');
    expect(attributes.stops.allowNull).toBe(false);
  });

  it('should have distanceKm as required float', () => {
    const attributes = Route.rawAttributes;
    expect(attributes.distanceKm.type.key).toBe('FLOAT');
    expect(attributes.distanceKm.allowNull).toBe(false);
  });

  it('should have estimatedDurationMin as required integer', () => {
    const attributes = Route.rawAttributes;
    expect(attributes.estimatedDurationMin.type.key).toBe('INTEGER');
    expect(attributes.estimatedDurationMin.allowNull).toBe(false);
  });
});