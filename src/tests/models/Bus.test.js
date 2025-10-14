import Bus from '../../models/Bus.js';

describe('Bus Model', () => {
  it('should define Bus model with correct attributes', () => {
    expect(Bus).toBeDefined();
    expect(Bus.name).toBe('Bus');
  });

  it('should have busId as unique string', () => {
    const attributes = Bus.rawAttributes;
    expect(attributes.busId.type.key).toBe('STRING');
    expect(attributes.busId.allowNull).toBe(false);
    expect(attributes.busId.unique).toBe(true);
  });

  it('should have registrationNo as required string', () => {
    const attributes = Bus.rawAttributes;
    expect(attributes.registrationNo.type.key).toBe('STRING');
    expect(attributes.registrationNo.allowNull).toBe(false);
  });

  it('should have operatorName as required string', () => {
    const attributes = Bus.rawAttributes;
    expect(attributes.operatorName.type.key).toBe('STRING');
    expect(attributes.operatorName.allowNull).toBe(false);
  });

  it('should have capacity as required integer', () => {
    const attributes = Bus.rawAttributes;
    expect(attributes.capacity.type.key).toBe('INTEGER');
    expect(attributes.capacity.allowNull).toBe(false);
  });

  it('should have routeId as required integer with reference', () => {
    const attributes = Bus.rawAttributes;
    expect(attributes.routeId.type.key).toBe('INTEGER');
    expect(attributes.routeId.allowNull).toBe(false);
    expect(attributes.routeId.references.model).toBe('Routes');
  });

  it('should have status enum with default idle', () => {
    const attributes = Bus.rawAttributes;
    expect(attributes.status.type.values).toEqual(['idle', 'on-trip', 'maintenance']);
    expect(attributes.status.defaultValue).toBe('idle');
  });

  it('should have currentLocation as JSON', () => {
    const attributes = Bus.rawAttributes;
    expect(attributes.currentLocation.type.key).toBe('JSON');
  });
});