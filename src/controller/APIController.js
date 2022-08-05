import db from "../models/index";
import userService from "../services/userService";

// api là 1 đường link
// json => object
let getAllUsers = async (req, res, next) => {
  let data = await userService.getAllUsers();

  return res.status(200).json({
    message: "Duke",
    errCode: 0,
    data,
  });
};

let getAUser = async (req, res, next) => {
  let id = req.query.id;

  // vì file index.js đã bắt middleware rồi nên ko cần validate ở đây nữa
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter",
      user: {},
    });
  }
  let data = await userService.getAUser(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "DukeUser",
    data,
  });
};

let handlecreateNewUser = async (req, res, next) => {
  let {
    firstName,
    lastName,
    email,
    address,
    password,
    phoneNumber,
    gender,
    roleId,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !address ||
    !password ||
    !phoneNumber ||
    !gender ||
    !roleId
  ) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
    });
  }

  let message = await userService.createNewUser(req.body);
  return res.status(200).json({
    message,
  });
};

let handlePutUser = async (req, res, next) => {
  let {
    firstName,
    lastName,
    email,
    address,
    password,
    phoneNumber,
    gender,
    roleId,
    id,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !address ||
    !password ||
    !phoneNumber ||
    !gender ||
    !roleId ||
    !id
  ) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
    });
  }

  let message = await userService.updateUser(req.body);
  return res.status(200).json({
    message,
  });
};

let handleDeleteAUser = async (req, res, next) => {
  let id = req.body.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
    });
  }

  let message = await userService.deleteAUser(id);
  return res.status(200).json({
    errCode: 0,
    message,
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
  getAUser,
  handlecreateNewUser,
  handlePutUser,
  handleDeleteAUser,
  handleLogin,
};
