const { Sequelize } = require('sequelize');
require('dotenv').config();

// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize("bookingcare", "root", "123456", {
//   // host: "localhost",
//   host: "0.0.0.0",
//   dialect: "mysql",
//   logging: false,
// });

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  dialect: 'mysql',
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  logging: false,
  query: {
    raw: true,
  },
  timezone: '+07:00',
});

let connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default {
  connection,
};
