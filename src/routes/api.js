import express from "express";
import APIController from "../controller/APIController";
import APIDoctorController from "../controller/APIDoctorController";
import {
  checkLogin,
  checkPatient,
  checkDoctor,
  checkAdmin,
} from "../middleware/JWTAction";

let router = express.Router();

const initAPIRouter = (app) => {
  router.get("/users", checkLogin, checkDoctor, APIController.getAllUsers); // method GET -> read data
  router.get("/user", APIController.getAUser); // method GET -> read data
  router.post("/create-user", checkLogin, APIController.handlecreateNewUser); // method POST -> create data
  router.put("/update-user", checkLogin, APIController.handlePutUser); // method PUT -> update data
  router.delete("/delete-user", checkLogin, APIController.handleDeleteAUser); // method DELETE -> delete data

  router.post("/login", APIController.handleLogin); // method POST ->
  router.post("/logout", checkLogin, APIController.handleLogout); // method POST ->
  // Router refreshToken when accessToken is invalid
  router.post("/refreshToken", APIController.requestRefreshToken);

  router.get("/allcode", APIController.handleGetAllCode); // method GET ->

  // Our doctors
  router.get("/doctor-home", APIDoctorController.handleGetDoctorHome); // method GET ->handleGetDoctorHome
  // router.get("/doctor-markdown", APIDoctorrController.handleGetDoctorMarkdown); // method GET ->handleGetDoctorMarkdown
  router.get("/get-all-doctors", APIDoctorController.handleGetAllDoctors); // method
  router.post("/save-infor-doctors", APIDoctorController.postInforDoctor); // method
  router.get("/get-detail-doctor", APIDoctorController.getDetailDoctor); // method

  return app.use("/api/v1/", router);
};

export default initAPIRouter;
