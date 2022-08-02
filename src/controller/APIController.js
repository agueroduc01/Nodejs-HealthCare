import db from "../models/index";
import userService from "../services/userService";
import CRUDService from "../services/CRUDService";

// api là 1 đường link
// json => object
let getAllUsers = async (req, res, next) => {
  let data = await CRUDService.getAllUsers();

  return res.status(200).json({
    message: "Duke",
    data,
  });
};

let createNewUser = async (req, res, next) => {
  let { firstName, lastName, email, address } = req.body;

  if (!firstName || !lastName || !email || !address) {
    return res.status(200).json({
      message: "Missing required parameters",
    });
  }

  await db.Users.create({
    firstName,
    lastName,
    email,
    address,
  });

  return res.status(200).json({
    message: "OK",
  });
};

let updateUser = async (req, res, next) => {
  let { firstName, lastName, email, address, id } = req.body;
  if (!firstName || !lastName || !email || !address || !id) {
    return res.status(200).json({
      message: "Missing required parameters",
    });
  }

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

  return res.status(200).json({
    message: "OK",
  });
};

let deleteUser = async (req, res, next) => {
  let id = req.params.id;
  if (!id) {
    return res.status(200).json({
      message: "Missing required parameters",
    });
  }
  // (Delete)
  await db.Users.destroy({
    where: {
      id,
    },
  });
  return res.status(200).json({
    message: "OK",
  });
};

let handleLogin = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameters",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  // check email exist
  // compare password
  // return userInfo
  // access token: JWT
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  handleLogin,
};
