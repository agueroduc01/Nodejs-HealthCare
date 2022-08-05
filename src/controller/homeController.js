import db from "../models/index";
import { multipleToObject } from "../ulti/convertToObject";
import multer from "multer";
import CRUDService from "../services/CRUDService";

// 1 la` dung query binh thuong(thì sẽ là promise)
// 2 la` dung ORM để sequelize tự động tạo
let getHomePage = async (req, res) => {
  // Dùng sequelize ORM
  let data = await CRUDService.getAllUsers();
  return res.render("home", {
    data,
    path: "/",
  });

  // Dùng query binh thuong, import pool từ connectDB
  // const [rows, fields] = await pool.execute('SELECT * FROM users')
};

let getAboutPage = (req, res) => {
  res.send("Welcome to the about page");
};

let getUserDetailPage = async (req, res) => {
  let id = req.params.id;
  // vì file index.js đã bắt middleware rồi nên ko cần validate ở đây nữa
  // if (!id) {
  //   return res.status(200).json({
  //     errCode: 1,
  //     errMessage: "Missing required parameter",
  //     user: {},
  //   });
  // }
  let user = await CRUDService.getAUser(id);
  // return res.send(JSON.stringify(user));
  return res.json({ user });
};

let postCreateNewUser = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.redirect("/");
};

let getCreateNewUser = (req, res) => {
  return res.render("user/createNewUser");
};

let deleteUser = async (req, res) => {
  let message = await CRUDService.deleteAUser(req.body.id);
  console.log(">>>delete: ", message);
  return res.redirect("/");
};

let getEditUser = async (req, res) => {
  let user = await CRUDService.getAUser(req.params.id);
  return res.render("user/editUser", { user });
};

let putEditUser = async (req, res) => {
  let message = await CRUDService.updateUser(req.body);
  console.log(">>>update: ", message);
  return res.redirect("/");
};

const upload = multer().single("profile_pic");

// POST
let handleUploadFile = async (req, res) => {
  console.log(req.file);
  console.log(">>> check file size: " + req.file.size);
  upload(req, res, function (err) {
    // req.file is the `profile_pic` file
    // req.body will hold the text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an file to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }

    // Display uploaded file for user validation
    res.send(`Upload thành công: <br><img src="/img/${req.file.filename}" width="400px"/>
        <div><a href="/upload">Upload another file</a></div>
        `);
  });
};

let handleUploadMultipleFiles = async (req, res) => {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (!req.files) {
    return res.send("Please select an file to upload");
  }

  const files = req.files;
  let result = `<div>Upload thành công: <br></div>`;
  files.map(
    (file) =>
      (result += `
        <img src="/img/${file.filename}" width="300px" height="400px" margin="36px" />
    `)
  );
  result += `<div><br><a href="/upload">Upload another file</a></div>`;
  return res.send(result);
};

module.exports = {
  getHomePage,
  getAboutPage,
  getUserDetailPage,
  postCreateNewUser,
  getCreateNewUser,
  deleteUser,
  getEditUser,
  putEditUser,
  handleUploadFile,
  handleUploadMultipleFiles,
};
