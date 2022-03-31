const CarOrder = require('../models/carOrderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getCarOrder = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const carOrder = await CarOrder.find({
        userInfo: id,
    });
    res.status(200).json({
        status: 'Get car order successfully',
        results: carOrder.length,
        data: { carOrder },
    });
});

exports.createCarOrder = catchAsync(async (req, res, next) => {
    const carOrder = await CarOrder.create({
        userInfo: req.user.id,
        carInfo: req.body.carInfo,
        time: req.body.time,
        place: req.body.place,
        deposit: req.body.deposit,
    });
    if (!carOrder) return next(new AppError('Create car order failed', 421));
    res.status(200).json({
        status: 'Create car order successfully',
        carOrder,
    });
});

exports.getAllCarOrder = catchAsync(async (req, res, next) => {
    const carOrders = await CarOrder.find({});
    res.status(200).json({
        status: 'Get All car order successfully',
        results: carOrders.length,
        data: { carOrders },
    });
});

exports.updateCarOrder = catchAsync(async (req, res, next) => {
    const updatedOrder = await CarOrder.findByIdAndUpdate(
        req.body.orderId,
        {
            status: req.body.status,
        },
        { new: true, runValidator: true }
    );
    if (!updatedOrder) return next(new Error('Can not found order with this id', 404));
    res.status(200).json({
        status: `Update order status ${updatedOrder.status} successfully`,
        updatedOrder,
    });
});
