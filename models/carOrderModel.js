const mongoose = require('mongoose');

const carOrderScheme = mongoose.Schema({
    userInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Car Order must have owner'] },
    carInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: [true, 'Car Order must have the info of car'],
    },
    time: {
        type: Date,
        required: [true, 'Car Order must have time to meet'],
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShowRoom',
        required: [true, 'Car Order must have the place to meet'],
    },
    deposit: {
        type: Number,
        required: [true, 'Car Order must have deposit'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Success', 'Cancelled'],
        default: 'Pending',
        required: [true, 'Car Order must have the status'],
    },
});

carOrderScheme.pre(/^find/, function (next) {
    this.populate({
        path: 'userInfo',
        select: 'name photo email info',
    })
        .populate({
            path: 'carInfo',
        })
        .populate({
            path: 'place',
        });
    next();
});

const CarOrder = mongoose.model('CarOrder', carOrderScheme);
module.exports = CarOrder;
