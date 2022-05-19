const CarOrder = require('../models/carOrderModel');
const Car = require('../models/carModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getCarOrder = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const carOrder = await CarOrder.find({
        userInfo: id,
    });
    if (!carOrder) return next(new AppError('Cannot get Car order', 404, 'Not Found'));
    res.status(200).json({
        status: 'success',
        message: 'Get car order successfully',
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
    //giảm số lượng xe trong kho
    const car = await Car.findByIdAndUpdate(
        req.body.carInfo,
        {$inc:{ amount: - 1 }},
        { new: true, runValidator: true });
    if (!car) return next(new AppError('decrease car amount failed', 421));
    res.status(200).json({
        status: 'success',
        message: 'Create car order successfully',
        carOrder,
    });
});

exports.getAllCarOrder = catchAsync(async (req, res, next) => {
    const carOrders = await CarOrder.find({});
    if (!carOrders) return next(new AppError('Cannot load all Car orders', 400, 'Bad Request'));
    res.status(200).json({
        status: 'success',
        message: 'Get All car order successfully',
        results: carOrders.length,
        data: { carOrders },
    });
});

exports.updateCarOrder = catchAsync(async (req, res, next) => {
    const carOrder = await CarOrder.findByIdAndUpdate(
        req.params.carOrderId,
        {
            status: req.body.status,
        },
        { new: true, runValidator: true }
    );
    if (!carOrder) return next(new Error('Can not found order with this id', 404));
    res.status(200).json({
        status: 'success',
        message: `Update order status ${carOrder.status} successfully`,
        carOrder,
    });
});

exports.deleteCarOrder = catchAsync(async (req, res, next) => {
    const { carOrderId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    if (!carOrderId) return next(new Error('Can not found car order with this id', 404));
    const deleteCarOrder = await CarOrder.findByIdAndDelete(carOrderId);
    if (!deleteCarOrder) return next(new Error('Can delete car order with this id', 404));
    res.status(200).json({
        status: 'success',
        message: 'Car order has been delete',
    });
});
