const mongoose = require('mongoose')

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2, 
        max: 50 
    },
    about: {
        type: String,
        max: 200 
    },
    sellerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    profileImg: {
        type: String
    },
    bannerImg: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
        min: 7,
        max: 15
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    addressLine1: {
        type: String,
        required: true,
        max: 100
    },
    addressLine2: {
        type: String,
        max: 100
    },
    // ratings: [{
    //     user: {
    //         type: mongoose.Types.ObjectId,
    //         ref: "User",
    //     },
    //     rating: {
    //         type: Number,
    //     },
    // }],
    // products: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: "Product"
    // }],
    status: {
        type: String,
        enum: ['approved','declined', 'pending'],
        default: 'pending'
    },
    activationToken: String,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    }
},
{
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
}
)

const ShopModel = mongoose.model('Shop', ShopSchema)

module.exports = ShopModel