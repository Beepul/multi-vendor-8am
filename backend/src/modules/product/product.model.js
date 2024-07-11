const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 2,
    },
    slug:{
        type: String,
        unique: true,
    },
    categories: [{
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        default: null
    }],
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
        default: null
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    summary: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
        min: 100
    },
    discount: {
        type: Number,
        min: 0,
        max: 90,
        default: 0
    },
    afterDiscount: {
        type: Number,
        min: 0,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    images: [{
        type: String,
    }],
    stock: {
        type: Number,
        default: 1,
        required: true,
    },
    colors: [{
        type: String,
    }],
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'Shop',
        default: null
    },
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

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
})

const ProductModel = mongoose.model('Product', ProductSchema)

module.exports = ProductModel;