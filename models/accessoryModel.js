const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Accessory must have name'],
    },
    code: {
        type: String,
        unique: true,
        required: [true, 'Accessory must have code product'],
    },
    price: {
        type: Number,
        required: [true, 'Accessory must have price'],
    },
    type: {
        type: String,
        enum: ['glass', 'wheel', 'none'],
        default: 'none',
        required: [true, 'Accessory must have type'],
    },
    image: {
        avatar:{type:String  ,required: [true, 'Accessory must have avatar']},
        banner:{type:String ,required: [true, 'Accessory must have banner']},
        gallery:[]
    },
    amount: {
        //số lượng
        type: Number,
        required: [true, 'Accessory must have amount'],
    },
    description: {
        //mô tả thông tin xe
        type: String,
        //required: [true, 'Accessory must have description'],
    },
    warrantyPeriod: {
        // thời gian bảo hành
        type: Number,
        required: [true, 'Accessory must have warranty period'],
    },
    specification: {}, //thông số kỹ thuật chưa tối ưu
    color: {
        type: [],
    },
});

// accessorySchema.virtual('accBills', {
//     ref: 'AccessoryBill',
//     localField: 'accessoryInfo.itemId',
//     foreignField: '_id',
// });

const Accessory = mongoose.model('Accessory', accessorySchema);
module.exports = Accessory;
