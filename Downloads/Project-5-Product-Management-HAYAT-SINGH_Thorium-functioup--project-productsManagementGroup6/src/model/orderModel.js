const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "userData",
        required: true,
        trim: true
    },
    items: [{
        productId: { type: ObjectId, ref: "Products", required: true ,trim: true},
        quantity: { type: Number, required: true,trim: true, min: 1 }
    }],
    totalPrice: { type: Number, required: true,trim: true, comment: "Holds total price of all the items in the cart" },
    totalItems: { type: Number, required: true,trim: true, comment: "Holds total number of items in the cart" },
    totalQuantity: { type: Number, required: true,trim: true, comment: "Holds total number of items in the cart" },
    cancellable: { type: Boolean, default: true },
    status: { type: String, enum:["pending", "completed", "cancelled"], default: 'pending', },
    deletedAt: { type: Date , default:""},
    isDeleted: { type: Boolean, default: false },

})

module.exports=mongoose.model('Order',orderSchema)