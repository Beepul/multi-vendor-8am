const Joi = require('joi')

const CategoryCreateDTO = Joi.object({
    title: Joi.string().min(3).required(), 
    status: Joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    image: Joi.string().empty(null, "").optional().default(null),
    parentId: Joi.string().allow(null, "").default(null)
})

const CategoryUpdateDTO = Joi.object({
    title: Joi.string().min(3).required(), 
    status: Joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    image: Joi.string().empty(null, "").optional().default(null),
    parentId: Joi.string().allow(null, "").default(null)
})


module.exports = {
    CategoryCreateDTO,
    CategoryUpdateDTO
}