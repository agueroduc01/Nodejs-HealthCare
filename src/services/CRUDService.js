import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        firstName,
        lastName,
        email,
        password,
        address,
        phoneNumber,
        roleId,
      } = data;
      let hashPasswordFromBcrypt = await hashUserPassword(password);
      await db.Users.create({
        firstName,
        lastName,
        email,
        password: hashPasswordFromBcrypt,
        address,
        phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId,
      });
      resolve("Created a new user successfully");
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (err) {
      reject(err);
    }
  });
};

let getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.Users.findAll({
        raw: true,
        nest: true,
      });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let getAUser = (idParam) => {
  return new Promise(async (resolve, reject) => {
    try {
      let id = idParam;
      let user = await db.Users.findOne({
        where: { id: id },
        attributes: ["email", "id", "firstName", "lastName", "address"],
        raw: true,
        nest: true,
      });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { firstName, lastName, email, address, id } = data;
      // (Update)
      let user = await db.Users.update(
        {
          firstName,
          lastName,
          email,
          address,
        },
        {
          where: { id },
          raw: true,
          nest: true,
        }
      );
      resolve("Updated a user successfully!");
    } catch (error) {
      reject(error);
    }
  });
};

let deleteAUser = (idParam) => {
  return new Promise(async (resolve, reject) => {
    try {
      let id = idParam;
      // Delete
      await db.Users.destroy({
        where: {
          id,
        },
      });
      resolve("Deleted a user successfully!");
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUsers,
  getAUser,
  updateUser,
  deleteAUser,
};
