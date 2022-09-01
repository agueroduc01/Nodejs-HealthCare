import express from "express";
import APIController from "../controller/APIController";
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
  // Router refreshToken when accessToken is invalid
  // router.post("/refreshToken", (req, res) => {
  //   let refreshToken = req.params.refreshToken;
  //   if (!refreshToken) res.sendStatus(401);
  //   if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
  //   try {
  //     let data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  //     let accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
  //       expiresIn: "3600s",
  //     });
  //     return res.status(200).json({
  //       accessToken
  //     })
  //   } catch (error) {
  //     return res.sendStatus(403);
  //   }
  // });

  router.get("/allcode", APIController.handleGetAllCode); // method GET ->

  return app.use("/api/v1/", router);
};

export default initAPIRouter;
