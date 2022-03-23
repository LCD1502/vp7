const mongoose = require('mongoose');

const showRoomSchema = new mongoose.Schema({
    address: { type: String, trim: true, required: [true, 'ShowRoom must have address'] },
    longitude:{type: String, trim: true, required: [true, 'ShowRoom must have longitude'] }, //kinh do
    latitude:{type: String, trim: true, required: [true, 'ShowRoom must have latitude'] }//vi do
}, { timestamps: true })


const ShowRoom = mongoose.model('ShowRoom', showRoomSchema);
module.exports = ShowRoom;