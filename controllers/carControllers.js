const Car = require('../models/carModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCars = catchAsync(async (req, res, next) => {
    const car = await Car.find({}); //.select('-image.gallery'); //.populate('author','name').select('content createdAt');
    const models = await Car.distinct('model');
    const years = await Car.distinct('year');
    res.status(200).json({
        status: 'success',
        results: car.length,
        data: { car },
        models,
        years,
    });
});

exports.getOneCar = catchAsync(async (req, res, next) => {
    const { carId } = req.params;
    const car = await Car.find({
        _id: carId,
    }); //.populate('author','name').select('content createdAt');
    if (!car) return next(new AppError('No Car found with this ID', 404));
    res.status(200).json({
        status: 'success',
        data: car,
    });
});

exports.createOneCar = catchAsync(async (req, res, next) => {
    //const { userId } = req.user;
    const car = await Car.create({ ...req.body });
    if (!car) return next(new Error('Create unsuccessful'));
    res.status(201).json({
        status: 'success',
        data: car,
    });
});

exports.updateOneCar = catchAsync(async (req, res, next) => {
    const { carId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const car = await Car.findByIdAndUpdate(carId, { ...req.body }, { new: true, runValidator: true });
    if (!car) return next(new AppError('No Car found with this ID', 404));
    res.status(200).json({
        status: 'success',
        data: car,
    });
});

exports.deleteOneCar = catchAsync(async (req, res, next) => {
    const { carId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const car = await Car.findByIdAndDelete(carId);
    if (!car) return next(new AppError('No Car found with this ID', 404));
    res.status(200).json({
        status: 'success',
        message: 'car has been delete',
    });
});

exports.compareTwoCars = catchAsync(async (req, res, next) => {
    const car1 = await Car.findById(req.body.carId1);
    const car2 = await Car.findById(req.body.carId2);
    if (!car1 || !car2) return next(new AppError('No Car found with this ID', 404));
    res.json({
        status: 'success',
        message: 'get data of two cars successfully',
        data: {
            car1,
            car2,
        },
    });
});

exports.carFilter = catchAsync(async (req, res, next) => {
    const searchString = req.query.keyword;
    delete req.query.keyword;

    let searchQuery = {};
    if (searchString) {
        searchQuery = {
            $text: { $search: searchString },
        };
    }
    const features = new APIFeatures(Car.find(searchQuery), req.query).filter().sort().limitFields().paginate();
    const docs = await features.query;
    res.json({
        status: 'success',
        results: docs.length,
        docs,
    });
});
