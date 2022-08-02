"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //up(add data)
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Users", [
      {
        email: "johnadam@gmail.com",
        password: "123456", // this is plain text -> hash password
        firstName: "John",
        lastName: "Adam",
        address: "87NewYorkCity,USA",
        phoneNumber: "0123456789",
        gender: 1,
        image: "",
        roleId: "R1",
        positionId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    //down (rollback)
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
