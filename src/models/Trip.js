import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Trip = sequelize.define('Trip', {
  tripId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Routes',
      key: 'id',
    },
  },
  busId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Buses',
      key: 'id',
    },
  },
  departureTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  arrivalTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Trip;