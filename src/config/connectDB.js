const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("bookingcare", "root", "123456", {
  // host: "localhost",
  host: "0.0.0.0",
  dialect: "mysql",
  logging: false,
});

// const sequelize = new Sequelize({
//   username: "root",
//   password: "123456",
//   database: "",
//   dialect: "mysql",
//   port: "",
//   host: "",
//   logging: false,
// });

let connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  connection,
};
