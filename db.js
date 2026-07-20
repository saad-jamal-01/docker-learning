const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('docker-test', 'postgres', 'Jeem99999', {
  host: 'db',
  dialect: 'postgres',
});

sequelize.authenticate()
    .then(() => console.log('DB connected'))
    .catch(error => console.log('Error at db connection'));

module.exports = sequelize;