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

module.exports = {
  handleGetDoctorHome,
};
