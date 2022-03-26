const mongoose = require('mongoose');

const accessoryBillSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cart: [{
        itemId: { 
            type: mongoose.Schema.Types.ObjectId, 
           // unique: true, 
            ref: 'Accessory' },
        quantity: { type: Number},// required: [true, 'Accessory must have amount'], },
    }],
    totalPrice: {
        type: Number,
        required: [true, 'Accessory bill must have total price'],
    },
    deliveryMethod: {
        type: String,
        enum: [''],
        default: ''
    },
    status: {
        type: Number,
        required: [true, 'Accessory bill must have status'],
    },
})


const AccessoryBill = mongoose.model('AccessoryBill', accessoryBillSchema);
module.exports = AccessoryBill;