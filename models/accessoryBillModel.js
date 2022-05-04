const mongoose = require('mongoose');

const accessoryBillSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        accessoryInfo: [
            {
                _id: false,
                itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accessory' },
                quantity: { type: Number, required: [true, 'Accessory must have amount'] },
            },
        ],
        totalPrice: {
            type: Number,
            required: [true, 'Accessory bill must have total price'],
        },
        deliveryMethod: {
            type: String,
            enum: ['COD'],
            default: '',
        },
        status: {
            type: String,
            enum: ['Pending', 'Success', 'Cancelled'],
            default: 'Pending',
            required: [true, 'Accessory bill must have status'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

accessoryBillSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'accessoryInfo.itemId',
        // populate: {
        //     path: 'itemId',
        //     model: 'Accessory',
        // },
    });
    next();
});

const AccessoryBill = mongoose.model('AccessoryBill', accessoryBillSchema);
module.exports = AccessoryBill;
