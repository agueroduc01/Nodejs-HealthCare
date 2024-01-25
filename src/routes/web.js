import express from "express";
import multer from "multer";
import path from "path";
import homeController from "../controller/homeController";
import navController from "../controller/navController";

let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/img/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const imageFilter = (req, file, cb) => {
  // Accept only images
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG||png||PNG||gif||GIF)$/)) {
    req.fileValidationError = "Only image files are allowed";
    return cb(new Error(req.fileValidationError), false);
  }
  cb(null, true);
};

// Can import ", limits: { fileSize: 1260163 }" to this upload if you want to limits the file size
const upload = multer({ storage: storage, fileFilter: imageFilter });

const uploadMultipleFiles = multer({
  storage: storage,
  fileFilter: imageFilter,
}).array("multiple_pics", 3);

const initWebRouter = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/get-create-new-user", homeController.getCreateNewUser);
  router.post("/post-create-new-user", homeController.postCreateNewUser);
  router.get("/detail-user/:id", homeController.getUserDetailPage);
  router.get("/edit-user/:id", homeController.getEditUser);
  router.post("/post-edit-user", homeController.putEditUser);
  router.post("/delete-user", homeController.deleteUser);
  router.get("/about", homeController.getAboutPage);
  router.post(
    "/upload-profile-pic",
    upload.single("profile_pic"),
    homeController.handleUploadFile
  );
  router.post(
    "/upload-multiple-pics",
    (req, res, next) => {
      uploadMultipleFiles(req, res, (err) => {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_UNEXPECTED_FILE"
        ) {
          // hanlde multer file limit error here
          return res.send("LIMIT_UNEXPECTED_FILE");
        } else if (err) {
          return res.send(err);
        } else {
          // make sure to call next() if all was well
          next();
        }
      });
    },
    homeController.handleUploadMultipleFiles
  );

  // Route navigation
  router.get("/upload", navController.getUploadFilePage);

  return app.use("/", router);
};

export default initWebRouter;
