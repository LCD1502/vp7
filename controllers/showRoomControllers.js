const ShowRoom = require('../models/showRoomModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllShowRooms = catchAsync(async (req, res, next) => {
    const showRoom = await ShowRoom.find({}); //.populate('author','name').select('content author createdAt');
    res.status(200).json({
        status: 'success',
        results: showRoom.length,
        data: { showRoom },
    });
});

exports.createOneShowRoom = catchAsync(async (req, res, next) => {
    //console.log(req.user);
    //res.json('sussess')
    //const { id } = req.user; // lấy user từ request sau khi giải token từ middleware
    const showRoom = await ShowRoom.create({ ...req.body });
    res.status(200).json({
        status: 'success',
        data: showRoom,
    });
});

exports.updateOneShowRoom = catchAsync(async (req, res, next) => {
    const { showRoomId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const showRoom = await ShowRoom.findByIdAndUpdate(showRoomId, { ...req.body }, { new: true, runValidator: true });
    if (!showRoom) {
        return next(new AppError('Cant found this showroom id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: showRoom,
    });
});

exports.deleteOneShowRoom = catchAsync(async (req, res, next) => {
    const { showRoomId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const showRoom = await ShowRoom.findByIdAndDelete(showRoomId);
    res.status(200).json({
        status: 'success',
        message: 'Showroom has been delete',
    });
});
