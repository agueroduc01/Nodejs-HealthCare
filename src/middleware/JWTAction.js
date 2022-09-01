import jwt from "jsonwebtoken";
require("dotenv").config();

const createJWT = (payload) => {
  let accessToken = null;
  let refreshToken = null;
  try {
    accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3600s",
    });
    refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    console.log("createJWT from JWTACtion", accessToken, payload);
  } catch (e) {
    console.log("Loi createJWT: ", e);
  }
  return accessToken;
};

const verifyToken = (token) => {
  let data = null;
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    data = decoded;
  } catch (error) {
    console.log(error);
  }
  return data;
};

let checkLogin = (req, res, next) => {
  // const authorizationHeader = req.headers["authorization"];
  // 'Bearer [token]'
  // const token = authorizationHeader.split(" ")[1];
  const token = req.cookies.token;
  if (!token)
    // res.status(401).json({
    res.status(200).json({
      error: `Authentication error. Token required.`,
      status: 401,
    }); // unauthorizeError
  let decodedData = null;
  try {
    decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.decodedData = decodedData;
    console.log("req.decodedData from checklogin", req.decodedData);
    next();
  } catch (error) {
    console.log(error);
    // return res.status(403).json('ban khong co quyen vao route nay'); // forbiden(ko có quyền truy xuất vào route hiện tại)
    return res.status(500).json({
      message: "Something wrong with verification",
    });
  }
};

let checkPatient = (req, res, next) => {
  let role = req.decodedData.roleId;
  if (role === "R3" || role === "R2" || role === "R1") {
    next();
  } else {
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
  createJWT,
  verifyToken,
  checkLogin,
  checkPatient,
  checkDoctor,
  checkAdmin,
};
