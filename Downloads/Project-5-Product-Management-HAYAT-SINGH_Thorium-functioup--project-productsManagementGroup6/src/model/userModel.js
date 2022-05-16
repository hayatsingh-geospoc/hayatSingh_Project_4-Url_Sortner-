const mongoose = require('mongoose')
const userModel = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    profileImage: {
        type: String,
        required: true,
        trim:true
    }, // s3 link
    phone: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        minLen: 8,
        maxLen: 15,
        trim:true
    }, // encrypted password
    address: {
        shipping: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type:Number, required: true }
        },
        billing: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type:Number, required: true }
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('userData', userModel)