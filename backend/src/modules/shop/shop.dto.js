const Joi = require("joi");

const CreateShopDTO = Joi.object({
    name: Joi.string().required().min(2).max(50),
    about: Joi.string().max(200).optional().allow("",null),
    phoneNumber: Joi.string().required().min(7).max(15),
    email: Joi.string().required().email(),
    addressLine1: Joi.string().required().max(100),
    addressLine2: Joi.string().optional().max(200).allow("",null),
    sellerId: Joi.string().required(),
    profileImg: Joi.string().allow(null, "").optional(),
    bannerImg: Joi.string().allow(null, "").optional()
})

module.exports = {
    CreateShopDTO
}