const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('consultation', 'postgres', 'mypassword', {
    host: 'localhost',
    dialect: 'postgres',
})

sequelize.authenticate()
    .then(() => console.log("Database is connected to postgresql server"))
    .catch((err) => console.log(err.message))


module.exports = sequelize