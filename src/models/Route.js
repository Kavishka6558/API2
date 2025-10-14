import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Route = sequelize.define('Route', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stops: {
    type: DataTypes.JSON, // Array of objects
    allowNull: false,
  },
  distanceKm: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  estimatedDurationMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Route;