const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartDetail: [{
        type: mongoose.Types.ObjectId,
        ref: 'CartDetail',
        required: true
    }],
    subTotal: {
        type: Number,
        required: true,
        min: 1
    },
    discountAmt: {
        type: Number,
        min: 0,
        default: 0
    },
    discountPer: {
        type: Number,
        min: 0,
        default: 0
    },
    deliveryCharge: {
        type: Number,
        min: 100,
        default: 100
    },
    totalAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online", "phonepay","bank"],
        default: "cod"
    },
    status: {
        type: String,
        enum: ['ordered', 'cancelled', 'completed'],
        default: "pending"
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
},{
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
})

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;