import db from "../models/index";
import userService from "../services/userService";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middleware/JWTAction";
require("dotenv").config();

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
    positionId,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !address ||
    !phoneNumber ||
    !gender ||
    !positionId ||
    !roleId
  ) {
    return res.status(200).json({
      message: { errCode: 1, errMessage: "Missing required parameters" },
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
    positionId,
    address,
    phoneNumber,
    gender,
    roleId,
    id,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !positionId ||
    !address ||
    !phoneNumber ||
    !gender ||
    !roleId ||
    !id
  ) {
    return res.status(200).json({
      message: { errCode: 1, errMessage: "Missing required parameters" },
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
  let accessToken = null;
  let refreshToken = null;
  if (userData && userData.errCode === 0 && userData.errMessage === "ok") {
    let payload = {
      id: `${userData.user.id}`,
      name: `${userData.user.firstName} ${userData.user.lastName}`,
      address: `${userData.user.address}`,
      roleId: `${userData.user.roleId}`,
    };
    accessToken = generateAccessToken(payload);
    refreshToken = generateRefreshToken(payload);

    // Nếu dùng REDIS thì bỏ res.cookie
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   path: "/",
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    // });
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .status(200)
      .json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user
          ? { ...userData.user, image: null, accessToken }
          : {},
      });
  }
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

// Thường dùng REDIS để lưu refreshToken
let requestRefreshToken = async (req, res) => {
  // Take refreshToken from user
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("You're not authenticated");
  // Kiểm tra trong REDIS nếu không có refreshToken thì báo lỗi
  // if (!refreshTokens.includes(refreshToken))
  //   return res.status(403).json("Refresh token is not available");
  try {
    let data = verifyRefreshToken(refreshToken);
    // Lọc (loại bỏ) refreshToken trong REDIS mà user vừa gửi request đến
    // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    data = {
      id: data.id,
      name: data.name,
      address: data.address,
      roleId: data.roleId,
    };
    let newAccessToken = generateAccessToken(data);
    let newRefreshToken = generateRefreshToken(data);
    // Thêm refreshToken mới vào REDIS
    // refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json("NOT FORBIDDEN!");
  }
};

let handleLogout = async (req, res) => {
  try {
    // Lọc (loại bỏ) refreshToken trong REDIS mà user vừa gửi request đến
    res.clearCookie("refreshToken");
    // const { refreshToken } = req.body;
    // if (!refreshToken) return res.status(401).json("You're not authenticated");
    // const data = verifyRefreshToken(refreshToken);
    // data = {
    //   id: data.id,
    //   name: data.name,
    //   address: data.address,
    //   roleId: data.roleId,
    // };
    // client.del(data.toString(), (err, reply) => {
    // if (err) {
    // return res.status(500).json({
    // errMessage: "Error from server (log out)"
    // })
    // }
    // return res.status(200).json({
    // errMessage: "Logout!"
    // })
    // })
    return res.status(200).json("Logged out !");
  } catch (error) {
    console.log("error from logged out", error);
    return res.status(500).json(`${error.message}`);
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
  requestRefreshToken,
  handleLogout,
};
