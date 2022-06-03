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
        avatar: { type: String },
        banner: { type: String },
        gallery: [],
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
        displacement: { type: Number, required: [true, 'Car must have specification'] }, //dung tích xy lanh
        power: { type: Number, required: [true, 'Car must have specification'] }, //công suất
        maxSpeed: { type: Number, required: [true, 'Car must have specification'] }, // tốc độ tối đa
        acceleration: { type: Number, required: [true, 'Car must have specification'] }, //tăng tốc 0-100
        weight: { type: Number, required: [true, 'Car must have specification'] }, // tải trọng
    },
    color: {
        type: [String],
        default: ['black', 'white'],
        enum: ['red', 'yellow', 'white', 'blue', 'green', 'orange', 'pink', 'grey', 'black', 'brown', 'purple'],
        required: [true, 'Car must have color'],
    },
    special: {
        // đặc điểm chức năng đặc biệt
        type: String,
    },
});

carSchema.index({ '$**': 'text' });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
