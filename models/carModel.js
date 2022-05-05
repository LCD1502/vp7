const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Car must have name'],
    },
    code: {
        type: String,
        unique: true,
        required: [true, 'Car must have code'],
    },
    price: {
        type: Number,
        required: [true, 'Car must have price'],
    },
    deposit: {
        type: Number,
        required: [true, 'Car must have deposit'],
    },
    image: {
        avatar:{type:String},
        banner:{type:String},
        gallery:[]
        // type: [],
        // default: 'default.png',
        // required: [true, 'Car must have image'],
    },
    amount: {
        //số lượng
        type: Number,
        required: [true, 'Car must have amount'],
    },
    description: {
        //mô tả thông tin xe
        type: String,
        required: [true, 'Car must have description'],
    },
    model: {
        //dòng
        type: String,
        required: [true, 'Car must have model'],
    },
    warrantyPeriod: {
        // thời gian bảo hành
        type: Number,
        required: [true, 'Car must have warranty period'],
    },
    year: {
        //năm săn xuất
        type: Number,
        required: [true, 'Car must have year'],
    },
    specification: {
        //thông số kỹ thuật
        displacement: { type: Number }, //dung tích xy lanh
        power: { type: Number }, //công suất
        maxSpeed: { type: Number }, // tốc độ tối đa
        acceleration: { type: Number }, //tăng tốc 0-100
        weight: { type: Number }, // tải trọng
    },
    color: {
        type: [],
        default: ['black', 'white'],
        required: [true, 'Car must have color'],
    },
    special: {
        // đặc điểm chức năng đặc biệt
        type: String,
    },
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
