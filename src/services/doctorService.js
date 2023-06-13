import db from '../models/index';

let getDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.Users.findAll({
        limit,
        order: [['createdAt', 'DESC']],
        attributes: {
          exclude: ['password'],
        },
        where: { roleId: 'R2' },
        include: [
          {
            model: db.Allcode,
            as: 'positionData',
            attributes: ['valueEn', 'valueVi'],
          },
          {
            model: db.Allcode,
            as: 'genderData',
            attributes: ['valueEn', 'valueVi'],
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

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.Users.findAll({
        where: {
          roleId: 'R2',
        },
        attributes: {
          exclude: ['password', 'image'],
        },
      });
      resolve({
        errCode: 0,
        doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // error boundary
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter',
        });
      } else {
        let data = await db.Users.findOne({
          where: {
            id: doctorId,
          },
          attributes: {
            exclude: ['password'],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown'],
            },
            {
              model: db.Allcode,
              as: 'positionData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          // decode image tu kieu du lieu BLOB, chuyen sang base64
          data.image = Buffer.from(data.image, 'base64').toString('binary');
        }
        //set object rong de server ko die
        if (!data) data = {};
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter',
        });
      } else {
        let doctorId = inputData.doctorId;
        let checkMarkdown = await db.Markdown.findOne({
          where: {
            doctorId,
          },
        });
        if (checkMarkdown) {
          await db.Markdown.update(
            {
              contentHTML: inputData.contentHTML,
              contentMarkdown: inputData.contentMarkdown,
              description: inputData.description,
              doctorId,
            },
            {
              where: { id: checkMarkdown.id },
              nest: true,
              raw: true,
            }
          );
          return resolve({
            errCode: 0,
            errMessage: 'Edit information doctor succeed',
          });
        } else {
          await db.Markdown.create(
            {
              contentHTML: inputData.contentHTML,
              contentMarkdown: inputData.contentMarkdown,
              description: inputData.description,
              doctorId,
            },
            {
              nest: true,
              raw: true,
            }
          );
          return resolve({
            errCode: 0,
            errMessage: 'Save information doctor succeed',
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getDoctorHome,
  getAllDoctors,
  getDetailDoctorById,
  saveDetailInforDoctor,
};
