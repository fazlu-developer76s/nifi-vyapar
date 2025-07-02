import joi from "joi"
import mongoose from 'mongoose';

 const objectId = joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
});


export const gstValidationSchema = joi.object({
  gstIn: joi.string()
    .length(15)
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .required()
    .messages({
      "string.pattern.base": "GSTIN must be a valid 15-character alphanumeric GST number",
    }),

  transaction: joi.string()
    // .alphanum()
    .min(10)
    .required()
    .messages({
      // "string.alphanum": "Transaction ID must be alphanumeric",
    }),

  location: joi.string()
    // .pattern(/^-?\d{1,3}\.\d{4},-?\d{1,3}\.\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "location must be in the format 'latitude,longitude'",
    }),
});

export const signuplogSchema = joi.object({
  email: joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) 
    // .required()
    .messages({
      'string.base': 'Email should be a string.',
      'string.pattern.base': 'Please provide a valid email address (e.g., user@example.com).',
      // 'any.required': 'Email is required.',
    }),

  mobile: joi.string()
    .pattern(/^[0-9]{10}$/) 
    .messages({
      'string.base': 'Mobile number should be a string.',
      'string.pattern.base': 'Mobile number should be exactly 10 digits.',
      // 'any.required': 'Mobile number is required.',
    }),

  otp: joi.string()
    .pattern(/^[0-9]{6}$/) 
    .optional() 
    .messages({
      'string.base': 'OTP should be a string.',
      'string.pattern.base': 'OTP should be exactly 6 digits.',
    }),
});


export const adminLoginSchema= joi.object({
  email: joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Please enter a valid email address"
    }),

  password: joi.string()
    .min(6)
    .required()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.min": "Password should be at least 6 characters long"
    }),

  otp: joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .optional()
    .allow("")
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers"
    })
});

export const validateCompany = joi.object({
  CompanyName: joi.string()
  .pattern(/^[A-Za-z\s]+$/)
  .required()
  .messages({
    'string.pattern.base': 'CompanyName must contain only alphabets and spaces.',
  })
    .optional()
    .allow(null, '')
    .messages({
      "string.base": "CompanyName must be a string",
    }),

  CompanyDomain: joi.string()
    .required()
    .messages({
      "any.required": "CompanyDomain is required",
      "string.base": "CompanyDomain must be a string",
      "string.empty": "CompanyDomain cannot be empty",
    }),

  CompanyMobile: joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "any.required": "CompanyMobile is required",
      "string.empty": "CompanyMobile cannot be empty",
      "string.pattern.base": "CompanyMobile must be a valid 10-digit number",
    }),

  Companyemail: joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Companyemail is required",
      "string.email": "Please provide a valid email address",
      "string.empty": "Companyemail cannot be empty",
    }),

  status: joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Status must be a boolean value (true or false)",
    }),

  userId: joi.string()
    .required()
    .messages({
      "any.required": "userId is required",
      "string.base": "userId must be a string (MongoDB ObjectId)",
      "string.empty": "userId cannot be empty",
    })
});


export const validateUpdateCompany = joi.object({
  CompanyName: joi.string()
  .pattern(/^[A-Za-z\s]+$/)
  .messages({
    'string.pattern.base': 'CompanyName must contain only alphabets and spaces.',
  })
    .optional()
    .allow(null, '')
    .messages({
      "string.base": "CompanyName must be a string",
    }),

  CompanyDomain: joi.string()
    .messages({
      "any.required": "CompanyDomain is required",
      "string.base": "CompanyDomain must be a string",
      "string.empty": "CompanyDomain cannot be empty",
    }),

  CompanyMobile: joi.string()
    .pattern(/^[0-9]{10}$/)
  .messages({
      "any.required": "CompanyMobile is required",
      "string.empty": "CompanyMobile cannot be empty",
      "string.pattern.base": "CompanyMobile must be a valid 10-digit number",
    }),

  Companyemail: joi.string()
    .email({ tlds: { allow: false } })
  .messages({
      "any.required": "Companyemail is required",
      "string.email": "Please provide a valid email address",
      "string.empty": "Companyemail cannot be empty",
    }),

  status: joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Status must be a boolean value (true or false)",
    }),

  userId: joi.string()
 .messages({
      "any.required": "userId is required",
      "string.base": "userId must be a string (MongoDB ObjectId)",
      "string.empty": "userId cannot be empty",
    })
}).unknown(true);



export const validateAdmCompany = joi.object({
  CompanyName: joi.string()
  .pattern(/^[A-Za-z\s]+$/)
  .required()
  .messages({
    'string.pattern.base': 'CompanyName must contain only alphabets and spaces.',
  })
    .optional()
    .allow(null, '')
    .messages({
      "string.base": "CompanyName must be a string",
    }),
 CompanyMobile: joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "any.required": "CompanyMobile is required",
      "string.empty": "CompanyMobile cannot be empty",
      "string.pattern.base": "CompanyMobile must be a valid 10-digit number",
    }),

  Companyemail: joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Companyemail is required",
      "string.email": "Please provide a valid email address",
      "string.empty": "Companyemail cannot be empty",
    }),
    address: joi.string() 
    .optional()
    .allow(null, '')  
    .messages({
      "string.base": "Address must be a string",
    }),
    gstIn: joi.string() 
    .optional() 
    .allow(null, '')
    .messages({
      "string.base": "GSTIN must be a string",
      "string.empty": "GSTIN cannot be empty",
    }),

 status: joi.string()
 .default("true")
 .allow(null,"")
    .optional()
    .messages({
      "string.base": "Status must be a string value (true or false)",
    }),
});



export const validateUpdateAdmCompany = joi.object({
  CompanyName: joi.string()
  .pattern(/^[A-Za-z\s]+$/)
  .messages({
    'string.pattern.base': 'CompanyName must contain only alphabets and spaces.',
  })
    .optional()
    .allow(null, '')
    .messages({
      "string.base": "CompanyName must be a string",
    }),

  CompanyMobile: joi.string()
    .pattern(/^[0-9]{10}$/)
  .messages({
      "any.required": "CompanyMobile is required",
      "string.empty": "CompanyMobile cannot be empty",
      "string.pattern.base": "CompanyMobile must be a valid 10-digit number",
    }),

  Companyemail: joi.string()
    .email({ tlds: { allow: false } })
  .messages({
      "any.required": "Companyemail is required",
      "string.email": "Please provide a valid email address",
      "string.empty": "Companyemail cannot be empty",
    }),
     address: joi.string() 
    .optional()
    .allow(null, '')  
    .messages({
      "string.base": "Address must be a string",
    }),
    gstIn: joi.string() 
    .optional() 
    .allow(null, '')
    .messages({
      "string.base": "GSTIN must be a string",
      "string.empty": "GSTIN cannot be empty",
    }),
  status: joi.string()
   .optional()
   .messages({
      "string.base": "Status must be a string value (true or false)",
    }),
}).unknown(true);





export const validatePackage = joi.object({
  packageName: joi.string()
  .pattern(/^[A-Za-z\s]+$/)
  .min(3)
  .required()
  .messages({
   'string.pattern.base': 'packageName must contain only alphabets and spaces.',
    "string.empty": "Package name cannot be empty",
    "string.min": "Package name must be at least 3 characters long",
  }),
  price: joi.number()
    .positive()
    .required()
    .messages({
      "any.required": "Price is required",
      "number.base": "Price must be a number",
      "number.positive": "Price must be a positive value",
    }),
    status: joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Status must be a boolean value (true or false)",
    })
  });

 export const validateUpdatePackage = joi.object({
    packageName: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(3)
    .messages({
      'string.pattern.base': 'packageName must contain only alphabets and spaces.',
      "string.empty": "Package name cannot be empty",
      "string.min": "Package name must be at least 3 characters long",
    }),
    price: joi.number()
      .positive()
      .messages({
        "any.required": "Price is required",
        "number.base": "Price must be a number",
        "number.positive": "Price must be a positive value",
      }),
      status: joi.boolean()
      .optional()
      .messages({
        "boolean.base": "Status must be a boolean value (true or false)",
      })
    });



  export const validateSeo = joi.object({
    page: joi.string()
      .required()
      .messages({
        "any.required": "Page is required",
        "string.empty": "Page cannot be empty",
      }),
  
      title: joi.string()
      .min(3)
      .required()
      .messages({
        "any.required": "Title is required",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must be at least 3 characters long",
      }),
    
  
      description: joi.string()
      .min(3)
      .required()
      .messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
        "string.min": "Description must be at least 3 characters long",
      }),
    
  
    keywords: joi.string()
      .required()
      .messages({
        "any.required": "Keywords are required",
        "string.empty": "Keywords cannot be empty",
      }),
  
    url: joi.string()
      .required()
      .messages({
        "any.required": "URL is required",
        "string.empty": "URL cannot be empty",
      }),
  
    image: joi.string()
      .optional()
      .allow('', null)
      .messages({
        "string.base": "Image must be a string",
      }),
  
    createdBy: joi.string()
      .optional()
      .messages({
        "string.base": "CreatedBy must be a valid User ID (string)",
      }),
  });



const addressSchema = joi.object({
  billingAddress: joi.string().optional().allow(null, ''),
  shippingAddress: joi.string().optional().allow(null, ''),
  state: joi.string()
    .valid(
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
      'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
      'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    )
    .optional()
    .empty('') 
    .allow(null)
});


const creditBalanceSchema = joi.object({
  openingBalance: joi.number().optional().default(0),

  asOfDate: joi.date()
    .allow('', null)  // allow empty string or null
    .optional()
    .messages({
      'date.base': 'asOfDate must be a valid date'
    }),

  creditLimitType: joi.string()
    .valid('No Limit', 'Custom Limit')
    .optional()
    .default('No Limit'),

  customCreditLimit: joi.number().optional()
});


export const validateParty = joi.object({
  partyName: joi.string()
    .required()
    .messages({
      "any.required": "Party name is required",
      "string.empty": "Party name cannot be empty",
    }),
      panNo: joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .optional()
    .allow('', null)
    .messages({
      "string.pattern.base": "PAN number must be in the format: 5 letters, 4 digits, and 1 letter (e.g., ABCDE1234F)",
    }),
status: joi.string()
  .valid('active', 'inactive')
  .empty('') // allow empty string to be treated as undefined
  .default('active')
  .messages({
    'string.empty': 'Status cannot be empty',
    'any.only': 'Status must be either active or inactive',
  }),


  gstIn: joi.string().optional().allow('', null),
  
  phoneNumber: joi.string().optional().allow('', null),
  
  gstType: joi.string()
    .valid(
      "Regular",
      "Registered Business - Regular",
      "Unregistered",
      "Composition",
      "Consumer",
      "Overseas",
      "SEZ",
      "Deemed Export"
    )
     .allow('', null)
  .optional()
    // .required()
    .messages({
      "any.required": "GST Type is required",
      "string.empty": "GST Type cannot be empty",
      "any.only": "Invalid GST Type selected",
    }),

  emailId: joi.string().email().optional().allow('', null),

  address: addressSchema.optional(),

  creditBalance: creditBalanceSchema.optional(),

  additionalFields: joi.object().optional(),
  actionBy:joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid category ObjectId");
    }
    return value;
  }), 
});


export const validateUpdateParty = joi.object({
  partyName: joi.string()
    .messages({
      "any.required": "Party name is required",
      "string.empty": "Party name cannot be empty",
    }),
 panNo: joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .optional()
    .allow('', null)
    .messages({
      "string.pattern.base": "PAN number must be in the format: 5 letters, 4 digits, and 1 letter (e.g., ABCDE1234F)",
    }),
  gstIn: joi.string().optional().allow('', null),
  
  phoneNumber: joi.string().optional().allow('', null),
  status: joi.string()
  .valid('active', 'inactive')
  .empty('') // allow empty string to be treated as undefined
  .default('active')
  .messages({
    'string.empty': 'Status cannot be empty',
    'any.only': 'Status must be either active or inactive',
  }),
  
 gstType: joi.string()
  .valid(
    "Regular",
    "Registered Business - Regular",
    "Unregistered",
    "Composition",
    "Consumer",
    "Overseas",
    "SEZ",
    "Deemed Export"
  )
  .allow('', null)
  .optional()
  .messages({
    "any.only": "Invalid GST Type selected",
  }),



  emailId: joi.string().email().optional().allow('', null),

  address: addressSchema.optional(),

  creditBalance: creditBalanceSchema.optional(),
  Balance: joi.string().optional().allow('', null),

  additionalFields: joi.object().optional(),
   actionBy:joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid category ObjectId");
    }
    return value;
  }), 
});



export const validateAdminRole = joi.object({
  AdminRolename: joi.string()
  .min(2)
  .required()
  .messages({
    "string.base": "Admin role name must be a string",
    "string.empty": "Admin role name is required",
    "string.min": "Admin role name must be at least 3 characters",
    "any.required": "Admin role name is required"
  }),

  status: joi.string()
    .optional()
    .allow(null, "")
});

export const validateUpdateAdminRole = joi.object({
  AdminRolename: joi.string()
  .min(2)
  .messages({
    "string.base": "Admin role name must be a string",
    "string.empty": "Admin role name is required",
    "string.min": "Admin role name must be at least 3 characters",
    "any.required": "Admin role name is required"
  }),

  status: joi.string()
    .optional()
    .allow(null, "")
});



export const validateMember = joi.object({
  name: joi.string()
    .min(3)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "any.required": "Name is required"
    }),

  email: joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required"
    }),

  mobile: joi.string()
    .optional()
    .allow(null, ""),

  status: joi.string().optional().allow(null, ""),

  role: objectId
  .optional()
  .allow(null, '')
  .messages({
    "any.required": "Role is required",
    "any.invalid": "Role must be a valid ObjectId"
  }),

    type: joi.string().optional() 
});


export const validateUpdateMember = joi.object({
  name: joi.string()
    .min(3)
 .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "any.required": "Name is required"
    }),

  email: joi.string()
    .email()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required"
    }),

  mobile: joi.string()
    .optional()
    .allow(null, ""),

  status: joi.string().optional().allow(null, ""),

  role: objectId
  .optional()
  .allow(null, '')
  .messages({
    "any.required": "Role is required",
    "any.invalid": "Role must be a valid ObjectId"
  }),

    type: joi.string().optional() 
});


export const categoryItemValidationSchema = joi.object({
  name: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(3)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'any.required': 'Name is required',
      'string.min': 'Name must be at least 3 characters long',
      'string.pattern.base': 'Name must contain only alphabets',
    }),
  status: joi.string()
    .valid('active', 'inactive')
    .default('active')
    .messages({
      'string.empty': 'Status cannot be empty',
      'any.only': 'Status must be either active or inactive',
    }),
});


export const gsttaxValidationSchema = joi.object({
  label: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(3)
    .required()
    .messages({
      'string.empty': 'Label is required',
      'string.min': 'Label must be at least 3 characters long',
      'any.required': 'Label is required',
      'string.pattern.base': 'Label must contain only alphabets',
    }),
  rate: joi.string()
    .required()
    .messages({
      'string.empty': 'Rate is required',
      'any.required': 'Rate is required',
    }),
  status: joi.string()
    .valid('active', 'inactive')
    .default('active')
    .messages({
      'string.empty': 'Status cannot be empty',
      'any.only': 'Status must be either active or inactive',
    }),
});

export const gstupdatetaxValidationSchema = joi.object({
  label: joi.string()
    .min(3)
    .optional()
    .messages({
      'string.empty': 'Label is required',
      'string.min': 'Label must be at least 4 characters long',
    }),
    
  rate: joi.string()
    .optional()
    .messages({
      'string.empty': 'Rate is required',
    }),
    
  status: joi.string()
    .valid('active', 'inactive')
    .optional()
    .default('active')
    .messages({
      'string.empty': 'Status cannot be empty',
      'any.only': 'Status must be either active or inactive',
    }),
});

export const itemCodeValidationSchema = joi.object({
  code: joi.string()
  .pattern(/^[0-9]+$/)
    // .min(5)
    .max(8)
    .required()
    .messages({
      'string.empty': 'Code is required',
      'string.pattern.base': 'Code must contain only alphabets',
      'string.min': 'Code must be at least 5 characters long',
      'string.max': 'Code must be at most 8 characters long',
      'any.required': 'Code is required',
    }),
  status: joi.string()
    .valid('active', 'inactive')
    .default('active')
    .messages({
      'string.empty': 'Status cannot be empty',
      'any.only': 'Status must be either active or inactive',
    }),
});

export const itemCodeUpdateValidationSchema = joi.object({
  code: joi.string()
  .pattern(/^[0-9]+$/)
    // .min(5)
    .max(8)
    .messages({
      'string.pattern.base': 'Code must contain only alphabets',
      'string.min': 'Code must be at least 5 characters long',
      'string.max': 'Code must be at most 8 characters long',
    }),

  status: joi.string()
    .valid('active', 'inactive')
    .messages({
      'string.empty': 'Status cannot be empty',
      'any.only': 'Status must be either active or inactive',
    }),
});


export const productValidationSchema = joi.object({
  itemName: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'itemName must contain only alphabets and spaces.',
    }),

  itemHSN: joi.string().required(),

  selectUnit: joi.object({
    baseUnit: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid baseUnit ObjectId");
      }
      return value;
    }),

    secondaryUnit: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid secondaryUnit ObjectId");
      }
      return value;
    }),

    conversionRate: joi.string().allow(null).optional()
  }),

  itemImage: joi.alternatives().try(
    joi.string().uri(),
    joi.string().pattern(/\.(jpg|jpeg|png|gif)$/i),
    joi.valid(null)
  ).optional(),

  category: joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid category ObjectId");
    }
    return value;
  }),

Godownid: joi.alternatives().try(
  joi.string().valid(null, "").optional(),
  joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid Godownid ObjectId");
    }
    return value;
  })
).optional(),



  itemCode: joi.string().allow(null).optional(),

  pricing: joi.object({
    salePrice: joi.object({
      withTax: joi.string().allow(null, "").optional(),
      withoutTax: joi.string().allow(null, "").optional(),
      discount: joi.object({
        type: joi.string().valid("percentage", "amount"),
        value: joi.string().required()
      }).optional()
    }),

    purchasePrice: joi.object({
      withTax: joi.string().allow(null, "").optional(),
      withoutTax: joi.string().allow(null, "").optional()
    }),

    taxRate: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid taxRate ObjectId");
      }
      return value;
    })
  }),

  stock: joi.object({
    openingQuantity: joi.string(),
    atPrice: joi.string(),
    asOfDate: joi.date(),
    minStockToMaintain: joi.string(),
    location: joi.string()
  }),

  onlineStore: joi.object({
    onlineStorePrice: joi.string().allow('').optional(),
    description: joi.string().allow('').optional()
  }).optional()
});


export const productUpdateValidationSchema = joi.object({
  itemName: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      'string.pattern.base': 'itemName must contain only alphabets and spaces.',
    }),

  itemHSN: joi.string(),

  selectUnit: joi.object({
    baseUnit: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid baseUnit ObjectId");
      }
      return value;
    }),

    secondaryUnit: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid secondaryUnit ObjectId");
      }
      return value;
    }),

    conversionRate: joi.string().allow(null).optional()
  }),

  itemImage: joi.alternatives().try(
    joi.string().uri(),
    joi.string().pattern(/\.(jpg|jpeg|png|gif)$/i),
    joi.valid(null)
  ).optional(),

  category: joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid category ObjectId");
    }
    return value;
  }),

  Godownid: joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid Godownid ObjectId");
    }
    return value;
  }),

  itemCode: joi.string().allow(null).optional(),

  pricing: joi.object({
    salePrice: joi.object({
      withTax: joi.string().allow(null, "").optional(),
      withoutTax: joi.string().allow(null, "").optional(),
      discount: joi.object({
        type: joi.string().valid("percentage", "amount"),
        value: joi.string()
      }).optional()
    }),

    purchasePrice: joi.object({
      withTax: joi.string().allow(null, "").optional(),
      withoutTax: joi.string().allow(null, "").optional()
    }),

    taxRate: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid taxRate ObjectId");
      }
      return value;
    })
  }),

  stock: joi.object({
    openingQuantity: joi.string(),
    atPrice: joi.string(),
    asOfDate: joi.date(),
    minStockToMaintain: joi.string(),
    location: joi.string()
  }),

  onlineStore: joi.object({
    onlineStorePrice: joi.string().allow('').optional(),
    description: joi.string().allow('').optional()
  }).optional()
});



export const ServiceCodeItemValidationSchema = joi.object({
  code: joi.string().required(),

  status: joi.string()
    .valid("active", "inactive")
    .optional(),
});

export const secondaryUnitValidationSchema = joi.object({
  name: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name must contain only alphabets and spaces.',
    }),

  status: joi.string()
    .valid("active", "inactive")
    .optional(), 
});


export const secondaryUnitUpdateValidationSchema = joi.object({
  name: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      'string.pattern.base': 'Name must contain only alphabets and spaces.',
    }),

  status: joi.string()
    .valid("active", "inactive")
    .optional(), 
});

export const serviceItemValidationSchema = joi.object({
  serviceName: joi.string()
  .required()
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      'string.pattern.base': 'serviceName must contain only alphabets and spaces.',
    }),

  serviceHSN: joi.string().required(),

  selectUnit: joi.object({
    baseUnit: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),

    secondaryUnit: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),

    conversionRate: joi.object({
      from: joi.string(),
      to: joi.string(),
    }).required()
  }).required(),

  itemImage: joi.string().optional(),

  category: joi.string()
  .allow(null, '')
  .optional()
  .custom((value, helpers) => {
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }),

  serviceCode: joi.string().allow(null, '').optional().custom((value, helpers) => {
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }),

  pricing: joi.object({
    salePrice: joi.object({
      withTax: joi.string().allow(null, ''),
      withoutTax: joi.string().allow(null, ''),
      discount: joi.object({
        type: joi.string().valid("percentage", "amount").allow(null, ''),
        value: joi.string().allow(null, '')
      }).optional()
    }).optional(),

    taxRate: joi.string().allow(null, '').custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
  }).optional(),

  onlineStore: joi.object({
    onlineStorePrice: joi.string().optional(),
    description: joi.string().optional()
  }).optional(),

  image: joi.string().allow(null, '')
});

export const serviceUpdateItemValidationSchema = joi.object({
  serviceName: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      'string.pattern.base': 'serviceName must contain only alphabets and spaces.',
    }),

  serviceHSN: joi.string(),

  selectUnit: joi.object({
    baseUnit: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),

    secondaryUnit: joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),

    conversionRate: joi.object({
      from: joi.string(),
      to: joi.string(),
    })
  }),

  itemImage: joi.string().optional(),

  category: joi.string()
  .allow(null, '')
  .optional()
  .custom((value, helpers) => {
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }),

  serviceCode: joi.string().allow(null, '').optional().custom((value, helpers) => {
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }),

  pricing: joi.object({
    salePrice: joi.object({
      withTax: joi.string().allow(null, ''),
      withoutTax: joi.string().allow(null, ''),
      discount: joi.object({
        type: joi.string().valid("percentage", "amount").allow(null, ''),
        value: joi.string().allow(null, '')
      }).optional()
    }).optional(),

    taxRate: joi.string().allow(null, '').custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
  }).optional(),

  onlineStore: joi.object({
    onlineStorePrice: joi.string().optional(),
    description: joi.string().optional()
  }).optional(),

  image: joi.string().allow(null, '')
});

export const primaryUnitValidationSchema = joi.object({
  name: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name must contain only alphabets and spaces.',
    }),

  status: joi.string().valid('active', 'inactive').default('active')
});

export const primaryUnitUpdateValidationSchema = joi.object({
  name: joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      'string.pattern.base': 'Name must contain only alphabets and spaces.',
    }),

  status: joi.string().valid('active', 'inactive').default('active')
});

export const permissionCategoryValidation = joi.object({
  title: joi.string().trim().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  status: joi.string().valid('active', 'inactive').default('active'),
});


export const permissionSubCategoryValidation = joi.object({
  title: joi.string().trim().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required"
  }),
  categoryId: joi.string().required().messages({
    "string.empty": "Permission Category ID is required",
    "any.required": "Permission Category ID is required"
  }),
  status: joi.string().valid("active", "inactive").default("active"),
});



 
export const permissionSubCategoryUpdateValidation = joi.object({
  title: joi.string().allow(null, '').trim().messages({
    "string.base": "Title must be a string",
  }),
  categoryId: joi.string().allow(null, '').messages({
    "string.base": "Permission Category ID must be a string",
  }),
  status: joi.string().valid("active", "inactive").default("active"),
});


export const roleValidationSchema = joi.object({
  Role: joi.string()
    .valid("1", "2", "3", "4", "5", "6", "7")
    .required()
    .messages({
      "any.required": "Role is required",
      "any.only": "Role must be one of 1 to 7",
    }),

  status: joi.string()
    .valid("active", "inactive")
    .optional()
    .messages({
      "any.only": "Status must be 'active' or 'inactive'",
    }),

  userId: joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.length": "User ID must be a valid 24-character hex string",
      "any.required": "User ID is required",
    }),

  roleId: joi.string()
    .length(24)
    .hex()
    .optional()
    .allow("")
    .messages({
      "string.length": "Role ID must be a valid 24-character hex string",
    }),
});

export const godownValidationSchema = joi.object({
  GodownType: joi.string()
    .valid(
      "Godwon",
      "Retail Store",
      "WholeSale Store",
      "Distributor",
      "Assembly Plant",
      "Others",
      "Main Store"
    )
    .allow(null),
 GodownName: joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .label("Godown Name"),

  // GodownName: joi.string().required(),
  emailId: joi.string().email().optional(),

  PhnNo: joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Phone number must be 10 digits")
    .optional(),

  gstIn: joi.string()
    .pattern(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/)
    .message("Invalid GSTIN format")
    .optional(),

  GodownAddress: joi.string().optional(),

  GodownPincode: joi.string()
    .pattern(/^[1-9][0-9]{5}$/)
    .message("Pincode must be a 6-digit number starting with 1-9")
    .optional()
});

export const godownUpdateValidationSchema = joi.object({
  GodownType: joi.string()
    .valid(
      "Godwon",
      "Retail Store",
      "WholeSale Store",
      "Distributor",
      "Assembly Plant",
      "Others",
      "Main Store"
    )
    .allow(null),

  GodownName: joi.string(),

  emailId: joi.string().email().optional(),

  PhnNo: joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Phone number must be 10 digits")
    .optional(),

  gstIn: joi.string()
    .pattern(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/)
    .message("Invalid GSTIN format")
    .optional(),

  GodownAddress: joi.string().optional(),

  GodownPincode: joi.string()
    .pattern(/^[1-9][0-9]{5}$/)
    .message("Pincode must be a 6-digit number starting with 1-9")
    .optional()
});

// export const stockValidationSchema = joi.object({

//   transferdate: joi.date().optional(),

//   From: objectId.required(),

//   To: objectId.required(),

//   ItmeName: joi
//     .array()
//     .items(objectId.required())
//     .min(1)
//     .required(),

//   QuantityTotransfer: joi.string().required(),
// });


const objectId2 = joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

export const stockValidationSchema = joi.object({
  transferdate: joi.date().optional(),
  From: objectId2.required(),
  To: objectId2.required(),
  ItemName: joi.array().items(objectId2.required()).min(1).required(),
  QuantityTotransfer: joi.string().required(),
});



const objectId3 = joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

export const rolePermissionValidation = joi.object({
  RoleId: objectId3.required().messages({
      "any.required": "RoleId is required",
      "any.invalid": "RoleId must be a valid ObjectId"
  }),
  PermissionId: objectId3.required().messages({
      "any.required": "PermissionId is required",
      "any.invalid": "PermissionId must be a valid ObjectId"
  }),
  SubPermissionId: objectId3.required().messages({
      "any.required": "SubPermissionId is required",
      "any.invalid": "SubPermissionId must be a valid ObjectId"
  }),
  status: joi.string().valid("active", "inactive").default("active")
});

export const rolePermissionUpdateValidation = joi.object({
  RoleId: objectId3.required().messages({
      "any.required": "RoleId is required",
      "any.invalid": "RoleId must be a valid ObjectId"
  }),
  PermissionId: objectId3.messages({
    
      "any.invalid": "PermissionId must be a valid ObjectId"
  }),
  SubPermissionId: objectId3.messages({
     
      "any.invalid": "SubPermissionId must be a valid ObjectId"
  }),
  status: joi.string().valid("active", "inactive").default("active")
});






export const saleInvoiceValidation = joi.object({
  party: objectId3.required(),
  Billingname: joi.string().required(),
  PhnNo: joi.string().required(),
  PONo: joi.string().allow(null, ''),
  PODate: joi.date().allow(null),
  EwayBillNo: joi.string().allow(null, ''),
  InvoiceNO: joi.string().required(),
  InvoiceDate: joi.date().required(),
  
  paymentTerms: joi.string().valid("custom", "Due on Reciept", "Net15", "Net30", "Net45", "Net60").required(),
  status: joi.string().valid("draft", "sent", "paid", "unpaid", "partially paid", "overdue").required(),

  stateofsupply: joi.string().valid(
    "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh",
    "Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa","Gujarat","Haryana",
    "Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry",
    "Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura Uttar Pradesh Uttarakhand West Bengal"
  ).required(),

  Item: objectId3.required(),
  count: joi.string().required(),
  qty: joi.string().required(),
  Freeqty: joi.string().allow(null, ''),
  unit: joi.object().unknown(true), 

  Priceperunit: joi.object({
    withTax: joi.string().required(),
    withoutTax: joi.string().required()
  }).required(),

  tax: objectId3.required(),
  Addcess: joi.string().allow(null, ''),
  amount: joi.string().required(),
  roundoff: joi.string().allow(null, ''),
  
  discount: joi.object({
    type: joi.string().valid("percentage", "amount").required(),
    value: joi.string().required()
  }).required(),

  total: joi.string().required(),
  recieved: joi.string().required(),
  paymentType: objectId3.required(),
  Description: joi.string().allow(null, ''),
  image: joi.string().uri().allow(null, ''), 
});
export const unitSchema = joi.object({
  unitName: joi.string().trim().required().messages({
    "string.base": `"unitName" should be a type of 'text'`,
    "string.empty": `"unitName" cannot be empty`,
    "any.required": `"unitName" is required`
  }),
  sortName: joi.string().trim().required().messages({
    "string.base": `"sortName" should be a type of 'text'`,
    "string.empty": `"sortName" cannot be empty`,
    "any.required": `"sortName" is required`
  })
});


const paymentTermsOptions = ['custom', 'Due on Reciept', 'Net15', 'Net30', 'Net45', 'Net60'];
const statusOptions = ['draft', 'sent', 'paid', 'unpaid', 'partially paid', 'overdue'];
const stateOptions = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir",
  "Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura Uttar Pradesh Uttarakhand West Bengal"
];

export const saleInvoiceValidationSchema = joi.object({
  party: objectId3.required(),

  Billingname: joi.string().allow(null, ''),
  PhnNo: joi.string().allow(null, ''),
  PONo: joi.string().allow(null, ''),
  PODate: joi.date().allow(null),
  EwayBillNo: joi.string().allow(null, ''),
  InvoiceNO: joi.string().allow(null, ''),
  InvoiceDate: joi.date().allow(null),

  paymentTerms: joi.string().valid(...paymentTermsOptions).allow(null),
  status: joi.string().valid(...statusOptions).allow(null),

  stateofsupply: joi.string().valid(...stateOptions).allow(null),

  Item: joi.array().items(objectId3).allow(null),

  count: joi.string().allow(null, ''),
  qty: joi.string().allow(null, ''),
  Freeqty: joi.string().allow(null, ''),
  unit: objectId.allow(null),

  Priceperunit: joi.object({
    withTax: joi.string().allow(null, ''),
    withoutTax: joi.string().allow(null, ''),
  }).allow(null),

  tax: objectId3.allow(null),
  Addcess: joi.string().allow(null, ''),
  amount: joi.string().allow(null, ''),
  roundoff: joi.string().allow(null, ''),

  discount: joi.object({
    type: joi.string().valid('percentage', 'amount').allow(null),
    value: joi.string().allow(null, ''),
  }).allow(null),

  total: joi.string().allow(null, ''),
  recieved: joi.string().allow(null, ''),
  paymentType: objectId3.allow(null),
  Description: joi.string().allow(null, ''),
  image: joi.string().allow(null, ''),
});

const objectId4 = () =>
  joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid ObjectId");
    }
    return value;
  }, "ObjectId validation");

export const paymentInValidation = joi.object({
  party: objectId4().required(),
  paymentType: objectId3.allow(null),
  description: joi.string().allow("", null),
  image: joi.string().uri().allow("", null),
  RecieptNo: joi.string().required(),
  Date: joi.date().required(),
  Recieved: joi.string().required(),
  discount: joi.object({
    type: joi.string().valid('percentage', 'amount').allow(null),
    value: joi.string().allow(null, ''),
  }).allow(null),

  Total: joi.string().required(),
});

export const paymentInUpdateValidation = joi.object({
  party: objectId4().optional(),
  paymentType: objectId4().optional(),
  description: joi.string().allow("", null),
  image: joi.string().uri().allow("", null),
  RecieptNo: joi.string().optional(),
  Date: joi.date().optional(),
  Recieved: joi.string().optional(),
  discount: joi.object({
    type: joi.string().valid('percentage', 'amount').allow(null),
    value: joi.string().allow(null, ''),
  }).allow(null),

  Total: joi.string().optional(),
});
const objectId5 = joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
});

 export const estimateQuotationSchema = joi.object({
  partyId: objectId5.required(),
  Billingname: joi.string().optional().allow(""),
  RefNo: joi.string().required(),
  InvoiceDate: joi.date().required(),
  status: joi.string().valid(
    "draft", "sent", "paid", "unpaid", "partially paid", "overdue", "completed"
  ).required(),
  stateofsupply: joi.string().valid(
    "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam",
    "Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu",
    "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir",
    "Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh",
    "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha",
    "Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
  ).required(),

  Item: joi.array().items(objectId5).min(1).required(),
  count: joi.string().optional().allow(""),
  qty: joi.string().optional().allow(""),
  Freeqty: joi.string().optional().allow(""),
  unit: objectId5.optional(),

  Priceperunit: joi.object({
    withTax: joi.string(),
    withoutTax: joi.string()
  }).xor("withTax", "withoutTax").required(),

  tax: objectId5.optional(),
  Addcess: joi.string().optional().allow(""),
  amount: joi.string().optional().allow(""),
  roundoff: joi.string().optional().allow(""),
  discount: joi.object({
    type: joi.string().valid("percentage", "amount").required(),
    value: joi.string().required()
  }).optional(),

  total: joi.string().optional().allow(""),
  paymentType: objectId5.optional(),
  Description: joi.string().optional().allow(""),
  image: joi.string().optional().allow(""),
});

export const accountnumberValidationSchema = joi.object({
  accountnumber: joi.string()
    .pattern(/^[0-9]{9,18}$/)
    .required()
    .messages({
      "string.pattern.base": "Account number must be 9 to 18 digits",
      "string.empty": "Account number is required",
    }),

  ifsc: joi.string()
    // .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/i)
    .required()
    .messages({
      "string.pattern.base": "Invalid IFSC code format",
      "string.empty": "IFSC code is required",
    }),

  transactionId: joi.string()
    .alphanum()
    .min(6)
    .required()
    .messages({
      "string.alphanum": "Transaction ID must be alphanumeric",
      "string.empty": "Transaction ID is required",
    }),

  latlong: joi.string()
    .pattern(
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
    )
    .required()
    .messages({
      "string.pattern.base": "Latlong must be in 'latitude,longitude' format",
      "string.empty": "Latlong is required",
    }),
});

export const panvalidation=joi.object({
  panNo: joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid PAN format",
      "string.empty": "PAN is required",
    }),
    
  transactionId: joi.string()
    .min(6)
    .required()
    .messages({
    
      "string.empty": "Transaction ID is required",
    }),

  latlong: joi.string()
    .pattern(
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
    )
    .required()
    .messages({
      "string.pattern.base": "Latlong must be in 'latitude,longitude' format",
      "string.empty": "Latlong is required",
    }),
});


export const UPIvalidation=joi.object({
  
  upiId: joi.string()
    .pattern(/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/)
  .required()
  .messages({
    'string.empty': 'UPI ID is required',
    'string.pattern.base': 'Invalid UPI ID format',
    'any.required': 'UPI ID is required',
    }),
    
  transactionId: joi.string()
    .min(6)
    .required()
    .messages({
    
      "string.empty": "Transaction ID is required",
    }),

  latlong: joi.string()
    .pattern(
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
    )
    .required()
    .messages({
      "string.pattern.base": "Latlong must be in 'latitude,longitude' format",
      "string.empty": "Latlong is required",
    }),
});

const faqBlockSchema = joi.object({
  title: joi.string().required(),
  faqs: joi.array().items(
    joi.object({
      question: joi.string().allow(null, ""),
      answer: joi.string().allow(null, "")
    })
  )
});


const footerSchema = joi.object({
  footerLogo: joi.string().allow(null, ""),
  footerText: joi.string().allow(null, ""),
  footerSections: joi.array().items(
    joi.object({
      heading: joi.string().allow(null, ""),
      footerLinks: joi.array().items(
        joi.object({
          label: joi.string().allow(null, ""),
          url: joi.string().uri().allow(null, ""),
          labelColor: joi.string().default("blue")
        })
      )
    })
  ),
  copyrightText: joi.string().allow(null, ""),
  FootersocialMedia: joi.array().items(
    joi.object({
      image: joi.string().allow(null, ""),
      url: joi.string().uri().allow(null, "")
    })
  ),
  Address: joi.object({
    street: joi.string().allow(null, ""),
    state: joi.string().allow(null, ""),
    pinCode: joi.string().allow(null, ""),
    textsize: joi.string().allow(null, ""),
    textFontFamily: joi.string().allow(null, "")
  }),
  footerEmail: joi.array().items(
    joi.object({
      foemail: joi.string().email().allow(null, "")
    })
  ),
  footerMobile: joi.array().items(
    joi.object({
      footermobile: joi.string().allow(null, "")
    })
  )
});


const testimonialSchema = joi.object({
  name: joi.string().allow(null, ""),
  review: joi.string().allow(null, "")
});


const categorySchema = joi.object({
  category: joi.string()
    .valid(
      "hero",
      "about",
      "solutions",
      "product-overview",
      "benefit-of-product",
      "targeted-segment",
      "faqs",
      "testimonial",
      "footer"
    )
    .required(),

  type: joi.string().valid("slider", "card").allow(null, ""),
  imageLocation: joi.number().valid(1, 2, 3).default(1),
  image: joi.string().allow(null, ""),
  h1: joi.string().allow(""),
  description: joi.string().allow(""),
  h1Color: joi.string().allow(""),
  descriptionColor: joi.string().allow(""),
  h1FontFamily: joi.string().allow(""),
  descriptionFontFamily: joi.string().allow(""),
  buttonColor: joi.string().allow(""),
  buttonText: joi.string().allow(""),
  buttonUrl: joi.string().allow(""),
  faqs: joi.string().allow(null, ""), 
  footer: joi.string().allow(null, ""),
  testimonials: joi.string().allow(null, ""),
  logo: joi.string().allow(null, ""),
  status: joi.boolean().default(true)
});


export const cmsValidationSchema = joi.object({
  userId: objectId4().allow(null),
  page: joi.string().required(),
  sections: joi.array().items(categorySchema),
  status: joi.boolean().default(true)
});


export const transactionValidation = joi.object({
  type: joi.string()
    .valid("credit", "debit")
    .optional()
    .allow(null),
from:joi.string().optional().allow(null,""),
to:joi.string().optional().allow(null,""),
  bankId: objectId4().optional().allow(null),
  userId: objectId4().optional().allow(null),
  actionBy: objectId4().optional().allow(null),

  refNo: joi.string().optional().allow("", null),

  amount: joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .message("Amount must be a valid number string with up to two decimals")
    .optional()
    .allow(null),

  Balance: joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .message("Balance must be a valid number string with up to two decimals")
    .optional()
    .allow(null),

  closingBalance: joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .message("Closing Balance must be a valid number string with up to two decimals")
    .optional()
    .allow(null),

  remark: joi.string().optional().allow("", null),
  description: joi.string().optional().allow("", null),

  date: joi.date().optional(),

  status: joi.string()
    .valid("pending", "failed", "success")
    .optional()
});

export const issueChequeValidation = joi.object({
  chequeSerialNumber:objectId4().allow(null).optional(),

 party:objectId4().allow(null,"").optional(),
  issueDate: joi.string().optional(), 
issuedBy:joi.string().optional(),
amount: joi.string().optional(),
toBankAccount:objectId4().allow(null,"").optional(),
  remarks: joi.string().optional(),
  payee:joi.string().optional().allow(null,""),
actionBy: joi.string().optional(),
  status: joi.string()
    .valid("issued", "cleared", "Rejected")
    .default("issued")
    .optional()
    .allow(null,""),
type: joi.string()
 .valid("credit", "debit")
 .optional().allow(null),
  })
  
  export const issueUpadteChequeValidation = joi.object({
  chequeSerialNumber:objectId4().allow(null,"").optional(),
 

 party:objectId4().allow(null,"").optional().allow(null,""),
  issueDate: joi.string().optional().allow(null,""), 
issuedBy:joi.string().optional().allow(null,""),
amount: joi.string().optional().allow(null,""),
toBankAccount:objectId4().allow(null,"").optional(),
  remarks: joi.string().optional(),
  payee:joi.string().optional().allow(null,""),

  status: joi.string()
    .valid("issued", "cleared", "Rejected")
    .default("issued")
    .optional()
    .allow(null,""),
type: joi.string()
 .valid("credit", "debit")
 .optional().allow(null,""),
  })

   export const chequeValidationSchema = joi.object({
  bankId: joi.string().required().messages({
    'any.required': 'bankId is required',
    'string.empty': 'bankId cannot be empty',
  }),
  chequeSerialNumber: joi.string().required().messages({
    'any.required': 'chequeSerialNumber is required',
    'string.empty': 'chequeSerialNumber cannot be empty',
  }),
  from: joi.string().optional(),
  to: joi.string().optional(),
  numberOfLeaves: joi.string().optional(),
   actionBy: joi.string().optional(),
  status: joi.string().valid("active", "used","cancelled","unused").optional(),
});


export const accountTypeValidation = joi.object({
type: joi.string()
 .required(),
 actionBy:joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid category ObjectId");
    }
    return value;
  }), 
});
export const accountTypeValidationup = joi.object({
  type: joi.string().optional(),

});


export const bankValidationSchema = joi.object({
  accountDisplayName: joi.string().required().messages({
    "any.required": "Account Display Name is required",
    "string.empty": "Account Display Name cannot be empty",
  }),
    AccountTypeId: objectId2.required().messages({
    "any.invalid": "Invalid Account Type ID",
    "any.required": "Account Type ID is required"
  }),

  accountnumber: joi.string()
    .pattern(/^\d+$/)
    // .required()
    .messages({
      "string.pattern.base": "Account Number must be numeric",
      "any.required": "Account Number is required",
      "string.empty": "Account Number cannot be empty",
    }),

  Balance: joi.string().required().messages({
    "any.required": "Balance is required",
    "string.empty": "Balance cannot be empty",
  }),

  asOfDate: joi.date().required().messages({
    "any.required": "As of Date is required",
    "date.base": "As of Date must be a valid date",
  }),

  ifscCode: joi.string().optional(),
  bankName: joi.string().optional(),
  accountHolderName: joi.string().optional(),
  branch: joi.string().optional(),
  upiIdName: joi.string().optional(),

  upiId: joi.string()
    .pattern(/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid UPI ID format",
    }),

  status: joi.string().valid("active", "inactive").default("active"),

  // userId: objectId2.required().messages({
  //   "any.invalid": "Invalid User ID",
  //   "any.required": "User ID is required"
  // }),


   actionBy:joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid category ObjectId");
    }
    return value;
  }), 
});



export const bankUpadteValidationSchema = joi.object({
  accountDisplayName: joi.string().required().messages({
    "any.required": "Account Display Name is required",
    "string.empty": "Account Display Name cannot be empty",
  }),

  accountnumber: joi.string()
    .pattern(/^\d+$/)
    // .required()
    .messages({
      "string.pattern.base": "Account Number must be numeric",
      "any.required": "Account Number is required",
      "string.empty": "Account Number cannot be empty",
    }),

  Balance: joi.string().required().messages({
    "any.required": "Balance is required",
    "string.empty": "Balance cannot be empty",
  }),

  asOfDate: joi.date().required().messages({
    "any.required": "As of Date is required",
    "date.base": "As of Date must be a valid date",
  }),

  ifscCode: joi.string().optional(),
  bankName: joi.string().optional(),
  accountHolderName: joi.string().optional(),
  branch: joi.string().optional(),
  upiIdName: joi.string().optional(),

  upiId: joi.string()
    .pattern(/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid UPI ID format",
    }),

  status: joi.string().valid("active", "inactive").default("active"),

  // userId: objectId2.required().messages({
  //   "any.invalid": "Invalid User ID",
  //   "any.required": "User ID is required"
  // }),

  AccountTypeId: objectId2.required().messages({
    "any.invalid": "Invalid Account Type ID",
    "any.required": "Account Type ID is required"
  }),
   actionBy:joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid category ObjectId");
    }
    return value;
  }), 
});

export const exportTransactionsValidation = joi.object({
  userId: joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      "string.hex": "userId must be a valid hex string",
      "string.length": "userId must be 24 characters long",
    }),

  bankId: joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      "string.hex": "bankId must be a valid hex string",
      "string.length": "bankId must be 24 characters long",
    }),

  type: joi.string()
    .valid("credit", "debit", "transfer") 
    .optional()
    .messages({
      "any.only": "type must be one of 'credit', 'debit', or 'transfer'",
    }),

  fromDate: joi.date()
    .iso()
    .optional()
    .messages({
      "date.format": "fromDate must be in ISO date format",
    }),

  toDate: joi.date()
    .iso()
    .optional()
    .messages({
      "date.format": "toDate must be in ISO date format",
    }),
}).and("fromDate", "toDate")  
  .messages({
    "object.and": "Both fromDate and toDate are required together",
  });

  export const userMemberCreateSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  mobile: joi.string().pattern(/^\d{10,15}$/).required(),
  role: objectId4().required(), 
 status: joi.boolean().optional().default(true),
});


export const userMemberUpdateSchema = joi.object({
  
  name: joi.string().optional(),
  email: joi.string().email().optional(),
  mobile: joi.string().pattern(/^\d{10,15}$/).optional(),
  role: objectId4().optional(),
  status: joi.boolean().optional(),
});

export const createUserRoleSchema = joi.object({
  UserRolename: joi.string().trim().required().messages({
    "string.empty": "Please Provide a Role.",
    "any.required": "UserRolename is required",
  }),
  status: joi.boolean().default(true).messages({
    "boolean.base": "Invalid status. Only true or false are allowed.",
  }),
})

export const createUpdateUserRoleSchema = joi.object({
  UserRolename: joi.string().trim().allow(null,"").messages({
    "string.empty": "Please Provide a Role.",
    "any.required": "UserRolename is required",
  }),
  status: joi.boolean().allow(null,"").messages({
    "boolean.base": "Invalid status. Only true or false are allowed.",
  }),
})


export const valiadteSupplier = joi.object({
  supplierName: joi.string()
    .required()
    .messages({
      "any.required": "Supplier name is required",
      "string.empty": "Supplier name cannot be empty",
    }),
      panNo: joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .optional()
    .allow('', null)
    .messages({
      "string.pattern.base": "PAN number must be in the format: 5 letters, 4 digits, and 1 letter (e.g., ABCDE1234F)",
    }),
status: joi.string()
  .valid('active', 'inactive')
  .empty('') // allow empty string to be treated as undefined
  .default('active')
  .messages({
    'string.empty': 'Status cannot be empty',
    'any.only': 'Status must be either active or inactive',
  }),


  gstIn: joi.string().optional().allow('', null),
  
  phoneNumber: joi.string().optional().allow('', null),
  
  gstType: joi.string()
    .valid(
      "Regular",
      "Registered Business - Regular",
      "Unregistered",
      "Composition",
      "Consumer",
      "Overseas",
      "SEZ",
      "Deemed Export"
    )
     .allow('', null)
  .optional()
    .required()
    .messages({
      "any.required": "GST Type is required",
      "string.empty": "GST Type cannot be empty",
      "any.only": "Invalid GST Type selected",
    }),

  emailId: joi.string().email().optional().allow('', null),

  address: addressSchema.optional(),



});


const objectIdValidator11 = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const productVariantSchema = joi.object({
  productId: joi.string().custom(objectIdValidator11, "ObjectId Validation").required().messages({
    "string.base": "Product ID must be a string",
    "any.invalid": "Product ID must be a valid ObjectId",
    "any.required": "Product ID is required",
  }),
 status: joi.string()
    .valid("active", "inactive")
    .optional()
    .messages({
      "any.only": "Status must be either 'active' or 'inactive'",
    }),
  sku: joi.string().required().messages({
    "string.base": "SKU must be a string",
    "string.empty": "SKU is required",
    "any.required": "SKU is required",
  }),

  barcode: joi.string().required().messages({
    "string.base": "Barcode must be a string",
    "string.empty": "Barcode is required",
    "any.required": "Barcode is required",
  }),

  quantity: joi.string().required().messages({
    "string.base": "Quantity must be a string",
    "string.empty": "Quantity is required",
    "any.required": "Quantity is required",
  }),

  saleprice: joi.string().required().messages({
    "string.base": "Sale price must be a string",
    "string.empty": "Sale price is required",
    "any.required": "Sale price is required",
  }),

  purchaseprice: joi.string().required().messages({
    "string.base": "Purchase price must be a string",
    "string.empty": "Purchase price is required",
    "any.required": "Purchase price is required",
  }),
});

export const updateproductVariantSchema = joi.object({
  productId: joi.string().custom(objectIdValidator11, "ObjectId Validation").required().messages({
    "string.base": "Product ID must be a string",
    "any.invalid": "Product ID must be a valid ObjectId",
    "any.required": "Product ID is required",
  }),
 status: joi.string()
    .valid("active", "inactive")
    .optional()
    .messages({
      "any.only": "Status must be either 'active' or 'inactive'",
    }),
  sku: joi.string().optional().allow('', null).messages({
    "string.base": "SKU must be a string",
    "string.empty": "SKU is required",
    "any.required": "SKU is required",
  }),

  barcode: joi.string().optional().allow('', null).messages({
    "string.base": "Barcode must be a string",
    "string.empty": "Barcode is required",
    "any.required": "Barcode is required",
  }),

  quantity: joi.string().optional().allow('', null).messages({
    "string.base": "Quantity must be a string",
    "string.empty": "Quantity is required",
    "any.required": "Quantity is required",
  }),

  saleprice: joi.string().optional().allow('', null).messages({
    "string.base": "Sale price must be a string",
    "string.empty": "Sale price is required",
    "any.required": "Sale price is required",
  }),

  purchaseprice: joi.string().optional().allow('', null).messages({
    "string.base": "Purchase price must be a string",
    "string.empty": "Purchase price is required",
    "any.required": "Purchase price is required",
  }),
});

export const createHSNSchema = joi.object({
  HSNcode: joi.string().trim().required().messages({
    "any.required": "HSN code is required",
    "string.empty": "HSN code cannot be empty",
  }),
  description: joi.string().required().messages({
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
  }),
  status: joi.string().valid("active", "inactive").optional(),
});

export const updateHSNSchema = joi.object({
  HSNcode: joi.string().trim().allow(null, "").optional(),
  description: joi.string().allow(null, "").optional(),
  status: joi.string().valid("active", "inactive").optional(),
});