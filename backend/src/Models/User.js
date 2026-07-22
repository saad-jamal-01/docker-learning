const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db');

const User = sequelize.define(
  'User',
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  },
);

User.sync({ alter: true })
    .then(() => console.log('User table synced'))
    .catch(error => console.log('Error at syncing User table : ', error.message));

module.exports = User;
