const Joi = require('joi')

const ProductCreateDTO = Joi.object({
    title: Joi.string().min(3).required(), 
    summary: Joi.string().required(),
    description: Joi.string().allow(null, "").optional().default(null),
    price: Joi.number().min(100).required(),
    discount: Joi.number().min(0).max(90).default(0),
    categories: Joi.array().items(Joi.string()).allow(null,"").optional().default(null),
    brand: Joi.string().allow(null, "").optional().default(null),
    isFeatured: Joi.boolean().default(false),
    sellerId: Joi.string().allow(null, "").default(null),
    status: Joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    images: Joi.array().items(Joi.string().allow(null, "")).allow(null,"").default(null),
    stock: Joi.number().min(1).required(),
    colors: Joi.array().items(Joi.string().allow(null, "")).allow(null, "").default(null)
})

const ProductUpdateDTO = Joi.object({
    title: Joi.string().min(3).required(), 
    summary: Joi.string().required(),
    description: Joi.string().allow(null, "").optional().default(null),
    price: Joi.number().min(100).required(),
    discount: Joi.number().min(0).max(90).default(0),
    categories: Joi.array().items(Joi.string()).allow(null,"").optional().default(null),
    brand: Joi.string().allow(null, "").optional().default(null),
    isFeatured: Joi.boolean().default(false),
    sellerId: Joi.string().allow(null, "").default(null),
    status: Joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    images: Joi.array().items(Joi.string().allow(null, "")).allow(null,"").default(null),
    stock: Joi.number().min(1).required(),
    colors: Joi.array().items(Joi.string().allow(null, "")).allow(null, "").default(null)
})


module.exports = {
    ProductCreateDTO,
    ProductUpdateDTO
}