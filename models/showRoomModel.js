const mongoose = require('mongoose');

const showRoomSchema = new mongoose.Schema(
    {
        address: { type: String, unique: true, trim: true, required: [true, 'ShowRoom must have address'] },
        description: { type: String, trim: true, required: [true, 'ShowRoom must have description'] },
        coordinate: {
            //unique: true,
            longitude: { type: String, trim: true, required: [true, 'ShowRoom must have longitude'] }, //kinh do
            latitude: { type: String, trim: true, required: [true, 'ShowRoom must have latitude'] }, //vi do
        },
    },
    { timestamps: true }
);

const ShowRoom = mongoose.model('ShowRoom', showRoomSchema);
module.exports = ShowRoom;
