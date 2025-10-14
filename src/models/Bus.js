import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Bus = sequelize.define('Bus', {
  busId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  registrationNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  operatorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Routes',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('idle', 'on-trip', 'maintenance'),
    defaultValue: 'idle',
  },
  currentLocation: {
    type: DataTypes.JSON, // {lat, lng, timestamp}
  },
}, {
  timestamps: true,
});

export default Bus;