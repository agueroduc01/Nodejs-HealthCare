import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

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
        gender,
        roleId,
        positionId,
        image,
      } = data;
      let check = await checkUserEmail(email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email address is already in use. Please try again!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(password);
        await db.Users.create({
          firstName,
          lastName,
          email,
          password: hashPasswordFromBcrypt,
          address,
          phoneNumber,
          gender,
          roleId,
          positionId,
          image: image ? image : null,
        });
        resolve({
          errCode: 0,
          errMessage: "Created a new user successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { firstName, lastName, address, phoneNumber, gender, roleId, id } =
        data;
      // (Update)
      let user = await db.Users.update(
        {
          firstName,
          lastName,
          address,
          phoneNumber,
          gender,
          roleId,
        },
        {
          where: { id },
          nest: true,
        }
      );
      if (user[0] !== 0) {
        resolve({
          errCode: 0,
          message: "Updated a user successfully!",
        });
      } else {
        resolve({
          errCode: 1,
          message: "User not found!",
        });
      }
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
      let check = await db.Users.destroy({
        where: {
          id,
        },
      });
      if (check === 1) {
        resolve("Deleted a user successfully!");
      } else {
        resolve("Cannot find a user with id!");
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCodeService = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!type) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  getAUser,
  createNewUser,
  updateUser,
  deleteAUser,
  getAllCodeService,
};
