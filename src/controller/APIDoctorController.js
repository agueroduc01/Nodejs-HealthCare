import doctorService from "../services/doctorService";
let handleGetDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: 1,
      errMessage: "Error from Server",
    });
  }
};

let handleGetAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server: " + error.message,
    });
  }
};

let getDetailDoctor = async (req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(infor);
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server: " + error.message,
    });
  }
};

let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server: " + error.message,
    });
  }
};

module.exports = {
  handleGetDoctorHome,
  handleGetAllDoctors,
  getDetailDoctor,
  postInforDoctor,
};
