const AccessoryBill = require('../models/accessoryBillModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getUserAccessoryBill = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const accessoryBill = await AccessoryBill.find({
        userId: id
    })//.populate('accessoryInfo.accessoryId', '_id').select('name');
    res.status(200).json({
        status: 'success',
        results: accessoryBill.length,
        data: { accessoryBill }
    })
});


exports.createUserAccessoryBill = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.find({ _id: id });// lay user
    const accessoryBill = await AccessoryBill.create({ accessoryinfo: user.cart, userId: id });// them cart vao bill

    //xoa cart trong user:
    const del = await User.findOneAndUpdate(id, { cart: [] })

    res.status(200).json({
        status: 'success',
        data: accessoryBill
    });
});



//admin manager  chưa xong

exports.getAllAccessoryBills = catchAsync(async (req, res, next) => {
    const accessoryBill = await AccessoryBill.find({}) //.populate('author','name').select('content createdAt');
    res.status(200).json({
        status: 'success',
        results: accessoryBill.length,
        data: { accessoryBill }
    })
});

// exports.createOneAccessory = catchAsync(async (req, res, next) => {
//     //const { userId } = req.user;
//     const accessory = await Accessory.create({ ...req.body });
//     res.status(200).json({
//         status: 'success',
//         data: accessory
//     });
// });

exports.updateOneAccessoryBill = catchAsync(async (req, res, next) => {
    const { accessoryId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const accessory = await Accessory.findByIdAndUpdate(accessoryId, { ...req.body }, { new: true, runValidator: true });
    res.status(200).json({
        status: 'success',
        data: accessory
    });
});

exports.deleteOneAccessoryBill = catchAsync(async (req, res, next) => {
    const { accessoryId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const accessory = await Accessory.findByIdAndDelete(accessoryId);
    res.status(200).json({
        status: 'success',
        message: 'accessory has been delete'
    });
});