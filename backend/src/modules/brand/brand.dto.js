const Joi = require('joi')

const brandCreateDTO = Joi.object({
    title: Joi.string().min(3).required(), 
    status: Joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    homeSection: Joi.boolean().default(false),
    image: Joi.string().empty(null, "").optional().default(null),
})

const brandUpdateDTO = Joi.object({
    title: Joi.string().min(3).required(), 
    status: Joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    image: Joi.string().empty(null, "").optional().default(null),
    homeSection: Joi.boolean().default(false)
})


module.exports = {
    brandCreateDTO,
    brandUpdateDTO
}