import jwt from "jsonwebtoken";
require("dotenv").config();

const generateAccessToken = (payload) => {
  let accessToken = null;
  try {
    accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15s",
    });
    console.log("createJWT from JWTACtion", accessToken, payload);
  } catch (e) {
    console.log("Loi createJWT: ", e);
  }
  return accessToken;
};

const generateRefreshToken = (payload) => {
  let refreshToken = null;
  try {
    refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  } catch (e) {
    console.log("Loi refreshToken: ", e);
  }
  return refreshToken;
};

const verifyRefreshToken = (token) => {
  let data = null;
  try {
    let decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    data = decoded;
  } catch (error) {
    console.log(error);
  }
  return data;
};

let checkLogin = (req, res, next) => {
  // 'Bearer [token]'
  const authorizationHeader = req.headers["authorization"];
  let token = null;
  if (authorizationHeader.indexOf(",") < 0) {
    token =
      authorizationHeader.split(" ")[1] || req.body.token || req.query.token;
  } else {
    token =
      authorizationHeader.split(",")[1].split(" ")[2] ||
      req.body.token ||
      req.query.token;
  }
  if (!token)
    res.status(401).json({
      // res.status(200).json({
      errMessage: `Authentication error. Token required.`,
      errCode: 401,
    }); // unauthorizeError
  let decodedData = null;
  try {
    decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.decodedData = decodedData;
    console.log("req.decodedData from checklogin", req.decodedData);
    next();
  } catch (error) {
    console.log("check login error", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(200).json({
        errCode: 401,
        errMessage: error.message,
        token: token,
      });
    } else {
      return res.status(500).json({
        errCode: 500,
        errMessage: "Something wrong with verification",
      });
    }
  }
};

let checkPatient = (req, res, next) => {
  let role = req.decodedData.roleId;
  if (role === "R3" || role === "R2" || role === "R1") {
    next();
  } else {
    // return res.status(403).json('ban khong co quyen vao route nay'); // forbiden(ko có quyền truy xuất vào route hiện tại)
    return res.status(403).json({
      message: "NOT PERMISSION",
      status: "403 Forbidden",
    });
  }
};

let checkDoctor = (req, res, next) => {
  let role = req.decodedData.roleId;
  if (role === "R2" || role === "R1") {
    next();
  } else {
    return res.status(403).json({
      message: "NOT PERMISSION",
      status: "403 Forbidden",
    });
    // return res.json({
    //   message: "NOT PERMISSION",
    //   status: "403 Forbidden",
    // });
  }
};

let checkAdmin = (req, res, next) => {
  let role = req.decodedData.roleId;
  if (role === "R1") {
    next();
  } else {
    // return res.status(403).json({
    //   message: "NOT PERMISSION",
    //   status: "403 Forbidden",
    // });
    return res.json({
      message: "NOT PERMISSION",
      status: "403 Forbidden",
    });
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  checkLogin,
  checkPatient,
  checkDoctor,
  checkAdmin,
};
