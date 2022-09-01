import db from "../models/index";
import userService from "../services/userService";
import { createJWT } from "../middleware/JWTAction";

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
  let { firstName, lastName, email, address, phoneNumber, gender, roleId, id } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !address ||
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
    return res.status(200).json({
      errCode: 1,
      message: "Missing inputs parameters",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  /**
   * Authentication(xác thực):
   * - check email exist
   * - compare password
   * - return userInfo
   */
  // Authorization(ủy quyền) : access token: JWT
  let token = null;
  if (userData && userData.errCode === 0 && userData.errMessage === "ok") {
    let payload = {
      id: `${userData.user.id}`,
      name: `${userData.user.firstName} ${userData.user.lastName}`,
      address: `${userData.user.address}`,
      roleId: `${userData.user.roleId}`,
    };
    token = createJWT(payload);
  }

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
    token,
  });
};

let handleGetAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (error) {
    console.error(">>Get all code server error: ", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getAllUsers,
  getAUser,
  handlecreateNewUser,
  handlePutUser,
  handleDeleteAUser,
  handleLogin,
  handleGetAllCode,
};
