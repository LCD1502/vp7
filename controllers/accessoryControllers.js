const Accessory = require('../models/accessoryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllAccessories = catchAsync(async (req, res, next) => {
    const accessory = await Accessory.find({}); //.populate('author','name').select('content createdAt');
    res.status(200).json({
        status: 'success',
        results: accessory.length,
        data: { accessory },
    });
});

exports.getOneAccessory = catchAsync(async (req, res, next) => {
    const { accessoryId } = req.params;
    const accessory = await Accessory.find({
        _id: accessoryId,
    }); //.populate('author','name').select('content createdAt');
    if (!accessory) return next(new AppError('No Accessory found with this ID', 404));
    res.status(200).json({
        status: 'success',
        data: accessory,
    });
});

exports.createOneAccessory = catchAsync(async (req, res, next) => {
    //const { userId } = req.user;
    const accessory = await Accessory.create({ ...req.body });
    res.status(201).json({
        status: 'success',
        data: accessory,
    });
});

exports.updateOneAccessory = catchAsync(async (req, res, next) => {
    const { accessoryId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const accessory = await Accessory.findByIdAndUpdate(
        accessoryId,
        { ...req.body },
        { new: true, runValidator: true }
    );
    if (!accessory) return next(new AppError('No Accessory found with this ID', 404));
    res.status(200).json({
        status: 'success',
        data: accessory,
    });
});

exports.deleteOneAccessory = catchAsync(async (req, res, next) => {
    const { accessoryId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const accessory = await Accessory.findByIdAndDelete(accessoryId);
    if (!accessory) return next(new AppError('No Accessory found with this ID', 404));
    res.status(200).json({
        status: 'success',
        message: 'accessory has been delete',
    });
});

exports.accessoryFilter = catchAsync(async (req, res, next) => {
    const searchString = req.query.keyword;
    delete req.query.keyword;

    let searchQuery = {};
    if (searchString) {
        searchQuery = {
            $text: { $search: searchString },
        };
    }
    const features = new APIFeatures(Accessory.find(searchQuery), req.query).filter().sort().limitFields().paginate();
    const docs = await features.query;
    res.json({
        status: 'success',
        results: docs.length,
        docs,
    });
});
