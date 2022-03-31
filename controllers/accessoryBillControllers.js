const AccessoryBill = require('../models/accessoryBillModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getUserAccessoryBill = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const accessoryBill = await AccessoryBill.find({
        userId: id,
    }); //.populate('accessoryInfo.accessoryId', '_id').select('name');
    res.status(200).json({
        status: 'success',
        results: accessoryBill.length,
        data: { accessoryBill },
    });
});

exports.createUserAccessoryBill = catchAsync(async (req, res, next) => {
    // bởi vì hàm protect đã lấy user từ database rồi, nên chính xác là user hiện tại, không cần get lại
    const accessoryBill = await AccessoryBill.create({
        userId: req.user.id,
        accessoryInfo: req.user.cart,
        totalPrice: req.body.totalPrice,
        deliveryMethod: req.body.deliveryMethod,
    }); // them cart vao bill
    if (!accessoryBill) return next(new AppError('Can not create accessoryBill', 400));
    //xoa cart trong user:
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.status(201).json({
        status: 'success',
        accessoryBill,
    });
});

//admin manager  chưa xong

exports.getAllAccessoryBills = catchAsync(async (req, res, next) => {
    const accessoryBill = await AccessoryBill.find({}); //.populate('author','name').select('content createdAt');
    res.status(200).json({
        status: 'success',
        results: accessoryBill.length,
        data: { accessoryBill },
    });
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
    const updatedAccessory = await AccessoryBill.findByIdAndUpdate(
        req.params.accessoryId,
        {
            status: req.body.status,
        },
        { new: true, runValidator: true }
    );
    if (!updatedAccessory) return next(new AppError('No Bill found', 404, 'Not Found'));
    res.status(200).json({
        updatedAccessory,
    });
});

// exports.deleteOneAccessoryBill = catchAsync(async (req, res, next) => {
//     const { accessoryId } = req.params;
//     //const {userId} = req.user; nhận userID nếu cần
//     const accessory = await Accessory.findByIdAndDelete(accessoryId);
//     res.status(200).json({
//         status: 'success',
//         message: 'accessory has been delete',
//     });
// });
