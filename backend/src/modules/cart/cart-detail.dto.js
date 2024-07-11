const Joi = require("joi");

const AddToCartDTO = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(0).required()
}) 

const PlaceOrderDTO = Joi.object({
    cartId: Joi.array().items(Joi.string().required()).required(),
    discount: Joi.number().empty(null, "").optional().default(0)
})

module.exports = {
    AddToCartDTO,
    PlaceOrderDTO
}