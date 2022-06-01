const mongoose = require('mongoose');

const accessoryBillSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        accessoryInfo: [
            {
                _id: false,
                itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accessory' },
                quantity: { type: Number, required: [true, 'Accessory must have amount'] },
                color: { type: String, required: [true, 'Accessory must have color'] },
            },
        ],
        totalPrice: {
            type: Number,
            required: [true, 'Accessory bill must have total price'],
        },
        place: {
            type: String,
            required: [true, 'Accessory bill must have place'],
        },
        deliveryMethod: {
            type: String,
            enum: ['COD'],
            default: '',
        },
        status: {
            type: String,
            enum: ['Pending','Accepted', 'Success', 'Cancelled'],
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
        select:'-image.banner -image.gallery -color',
        // populate: {
        //     path: 'itemId',
        //     model: 'Accessory',
        // },
    })
    // .populate({
    //     path: 'userId',
    //     select:'-wishList -cart -photo',
    // });
    next();
});

const AccessoryBill = mongoose.model('AccessoryBill', accessoryBillSchema);
module.exports = AccessoryBill;
