import db from "../models/index";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        // user already exists
        let user = await db.Users.findOne({
          where: { email },
        });
        if (user) {
          // compare password
          // hash the password (bcrypt)
          let checkPassword = await bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            userData.errCode = 0;
            userData.errMessage = "ok";
            delete user.password;
            delete user.email;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = `Wrong password`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User's not found";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your's email isn't exists in your system. Please try other email!`;
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.Users.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.Users.findAll({
        nest: true,
        attributes: {
          exclude: ["password"],
        },
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
        nest: true,
      });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  getAUser,
};
