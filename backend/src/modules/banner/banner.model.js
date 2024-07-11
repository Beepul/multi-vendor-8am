const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 3,
    },
    link: String, 
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    image: {
        type: String,
        required: true,
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

const BannerModel = mongoose.model('Banner', BannerSchema)

module.exports = BannerModel;