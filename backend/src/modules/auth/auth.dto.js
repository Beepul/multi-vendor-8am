const Joi = require("joi");



// in regex '/' is starting and another '/' is ending
// to start writing pattern or regex exp open with '^' and end with '$'
// () -> for grouping
// | -> for or statement
// 0-9 -> number range
// [0-9] -> search from 0 to 9
// a-z -> alphabet range
// [a-z] -> search from a to z
// [a-zA-Z0-9] -> alpha numeric value
// [\d] -> digit tei [0-9]
// [\w] -> characters tei [a-zA-Z]
// [\w\d] => alpha numeric value tei [a-zA-Z0-9] 

// Register Data Transfer Object
const registerDTO = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required().min(7),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().pattern(/^(seller|customer|admin)$/)
})


const loginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const ResendActivationDTO = Joi.object({
    email: Joi.string().email().required()
})

const UpdateDTO = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().required().min(7),
    image: Joi.any().optional()
})

const UpdatePasswordDTO = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
})

const ResetPasswordDTO = Joi.object({
    resetToken: Joi.string().required(),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
})

module.exports = {
    registerDTO,
    loginDTO,
    ResendActivationDTO,
    UpdateDTO,
    UpdatePasswordDTO,
    ResetPasswordDTO
}