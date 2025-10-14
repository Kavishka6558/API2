import User from '../../models/User.js';

describe('User Model', () => {
  it('should define User model with correct attributes', () => {
    expect(User).toBeDefined();
    expect(User.name).toBe('User');
  });

  it('should have username as unique string', () => {
    const attributes = User.rawAttributes;
    expect(attributes.username.type.key).toBe('STRING');
    expect(attributes.username.allowNull).toBe(false);
    expect(attributes.username.unique).toBe(true);
  });

  it('should have password as required string', () => {
    const attributes = User.rawAttributes;
    expect(attributes.password.type.key).toBe('STRING');
    expect(attributes.password.allowNull).toBe(false);
  });

  it('should have role as required enum', () => {
    const attributes = User.rawAttributes;
    expect(attributes.role.type.values).toEqual(['admin', 'bus_operator', 'commuter']);
    expect(attributes.role.allowNull).toBe(false);
  });
});