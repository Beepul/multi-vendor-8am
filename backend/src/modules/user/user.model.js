const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    houseNo: String,
    streetName: String,
    ruralDev: String,
    district: String,
    province: String

})

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        min: 2, 
        max: 50 
    },
    password: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    role: {
        type: String,
        enum: ['seller','customer','admin'],
        default: 'customer'
    },
    status: {
        type: String, 
        enum: ['active', 'inactive'],
        default: "inactive"
    },
    activationToken: String,
    phone: String,
    image: String,
    address: {
        shippingAddress: AddressSchema,
        billingAddress: AddressSchema,
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
},{ 
    timestamps: true,
    autoCreate: true, // create table automatically if there is no tabel
    autoIndex: true // indexing
})

const UserModel = mongoose.model("User", UserSchema)


module.exports = UserModel