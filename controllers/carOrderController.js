const CarOrder = require('../models/carOrderModel')
const catchAsync = require('../ultis/catchAsync')
const AppError = require('../utils/appError')
const User = required('..models/userModel')

exports.getCarOrder = catchAsync(async (req, res, next) => {
    const { id } = req.user
    const carOrder = await CarOrder.find({
        userId: id,
    })
    res.status(200).json({
        status: 'success',
        results: carOrder.length,
        data: { carOrder }
    })
})

exports.createCarOrder = catchAsync(async (req, res, next) => {
    const carOrder = await CarOrder.create({
        userId: req.user.id,
        carCode: req.body.code,
        place: req.body.place
    })
    res.status(200).json({
        status: 'success',
        carOrder,
    })

})

exports.getAllCarOrder = catchAsync(async (req, res, next) => {
    const carOrders = await CarOrder.find({})
    res.status(200).json({
        status: 'sussess',
        results: carOrders.length,
        data: { carOrders }
    })
})