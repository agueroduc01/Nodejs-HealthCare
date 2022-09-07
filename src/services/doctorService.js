import db from "../models/index";

let getDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.Users.findAll({
        limit,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        where: { roleId: "R2" },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getDoctorHome,
};
