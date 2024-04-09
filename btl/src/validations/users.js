const Joi = require('joi');
const registrationSchema = Joi.object({
    username: Joi.string().alphanum().min(6).max(255).required().messages({
        'string.base': 'Username phải là chuỗi.',
        'string.empty': 'Username không được để trống.',
        'string.min': 'Username phải có ít nhất {#limit} ký tự.',
        'string.max': 'Username không được vượt quá {#limit} ký tự.',
        'any.required': 'Username là bắt buộc.'
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.ref('password'),
    email: Joi.string().email().required().messages({
        'string.email': 'Email phải có định dạng email hợp lệ.',
        'string.empty': 'Email không được để trống.',
        'any.required': 'Email là bắt buộc.'
    }),
    role:Joi.string()
}).with('password', 'confirmPassword');


const loginSchema = Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().email().required().messages({
        'string.email': 'Email phải có định dạng email hợp lệ.',
        'string.empty': 'Email không được để trống.',
        'any.required': 'Email là bắt buộc.'
    }),
}).with('password', 'confirmPassword');
module.exports ={registrationSchema,loginSchema};