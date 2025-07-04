import joi from 'joi';

const loginValidation = joi.object({
  credential: joi.string().required().messages({
    'string.empty': 'Please provide a valid credential',
  }),
});

const sendLoginOtp = joi.object({
    login_key: joi.string().required().messages({
      'string.empty': 'Please provide a valid login key',
    }),
});

export{
    loginValidation,sendLoginOtp
}