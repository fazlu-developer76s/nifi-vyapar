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

const roleValidation = joi.object({
    role: joi.string().required().messages({
        'string.empty': 'Role is required'
    }),
    status: joi.string().required().messages({
        'string.empty': 'Role status is required'
    })
});

export{
    loginValidation,
    roleValidation,
    sendLoginOtp
}