const mongoose = require('mongoose');
const OrderModel = require('./order.model')

const CartDetailSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
        default: null,
    },
    productDetail: {
        title: String,
        slug: String,
        price: Number,
        afterDiscount: Number,
        discount: Number,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    amount: {
        type: Number,
    },
    sellerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'ordered', 'cancelled', 'completed']
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },
    UpdatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
})

const CartDetailModel = mongoose.model('CartDetail', CartDetailSchema);

module.exports = CartDetailModel;