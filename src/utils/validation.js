import joi from 'joi';

 const loginValidation = joi.object({
    credential: joi.string().required().messages({
        'string': 'Invalid email format',
        'any.required': 'Email is required',
    })
    // password: joi.string().min(6).required().messages({
    //     'string.min': 'Password must be at least 6 characters long',
    //     'any.required': 'Password is required',
    // }),
});

export{
    loginValidation
}