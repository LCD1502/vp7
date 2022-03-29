const mongoose = require('mongoose')

const carOrderScheme = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    carInfo: [
        {
            _id: false,
            carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car'}
        }
    ],
    time: { 
        type: Date, 
        default: Date.now,
        required: [true, 'Car Order must have time']
    },
    place: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'showRoom',
        required: [true, 'Car Order must have the place to meet']
    },
    deposit: { 
        type: Number,
        required: [true, 'Car Order must have deposit'],
    },
    status: {
        enum: ['Pending', 'Success', 'Cancelled'],
        default: 'Pending',
        required: [true, 'Car Order must have the status'],
    }

})