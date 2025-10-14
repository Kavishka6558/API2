import sequelize from '../config/db.js';
import Route from './Route.js';
import Bus from './Bus.js';
import Trip from './Trip.js';
import User from './User.js';

// Associations
Route.hasMany(Bus, { foreignKey: 'routeId' });
Bus.belongsTo(Route, { foreignKey: 'routeId' });

Route.hasMany(Trip, { foreignKey: 'routeId' });
Trip.belongsTo(Route, { foreignKey: 'routeId' });

Bus.hasMany(Trip, { foreignKey: 'busId' });
Trip.belongsTo(Bus, { foreignKey: 'busId' });

export { Route, Bus, Trip, User };