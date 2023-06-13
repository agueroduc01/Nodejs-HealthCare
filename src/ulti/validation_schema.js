import Joi from 'joi';

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).max(10).required(),
  firstName: Joi.string().lowercase().required(),
  lastName: Joi.string().lowercase().required(),
  address: Joi.string().min(2).lowercase().required(),
  //   address: {
  //     state: Joi.string().length(2).lowercase().required(),
  //   },
  phoneNumber: Joi.string().length(10).lowercase().required(),
  gender: Joi.string().lowercase().required(),
  positionId: Joi.string().lowercase().required(),
  roleId: Joi.string().lowercase().required(),
  image: Joi.string().lowercase(),
});

module.exports = {
  authSchema,
};
