import joi from 'joi';

const loginValidation = joi.object({
  credential: joi.string().required().messages({
    'string.empty': 'Please provide a valid credential',
  }),
});

const sendLoginOtp = joi.object({
    login_key: joi.string().required().messages({
      'string.empty': 'Please provide a valid email or mobile number',
    }),
});

const signInValidation = joi.object({
  login_key: joi.string().required().messages({
    'string.empty': 'Please provide a valid email or mobile number',
    'any.required': 'Login key is required',
  }),
  otp: joi.string().length(6).required().messages({
    'string.length': 'OTP must be exactly 6 digits',
    'string.empty': 'OTP is required',
    'any.required': 'OTP is required',
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
const categoryValidation = joi.object({
    category_name: joi.string().required().messages({
        'string.empty': 'Category is required'
    }),
    status: joi.string().required().messages({
        'string.empty': 'Category status is required'
    })
});

const companyValidation = joi.object({
  CompanyName: joi.string().required().messages({
    'string.empty': 'Company name is required',
  }),
  CompanyMobile: joi.string().pattern(/^\d{10}$/).required().messages({
    'string.empty': 'Mobile number must be 10 digits',
  }),
  Companyemail: joi.string().email().required().messages({
    'string.empty': 'Email must be a valid email address',
  }),
  address: joi.string().required().messages({
    'string.empty': 'Address is required',
  }),
  gstIn: joi.string().max(15).allow('', null).messages({
    'string.max': 'GSTIN must be at most 15 characters',
  }),
  status: joi.string().valid("active", "inactive").optional().messages({
    'any.only': 'Status must be either "active" or "nactive"',
  }),
});


export{
    loginValidation,
    roleValidation,
    sendLoginOtp,
    signInValidation,
    categoryValidation,
    companyValidation
 
}