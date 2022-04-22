const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const SearchFeature = require('../utils/searchFeature');
const Accessory = require('../models/accessoryModel');

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.find({
        _id: req.body.id,
    }).select('+active');
    res.json({
        status: 'Get User successfully',
        user,
    });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find().select('+active');
    res.json({
        users,
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    res.json({
        status: 'Get Me successfully',
        user: req.user,
    });
});

exports.updateInfo = catchAsync(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(
        req.user.id,
        {
            info: req.body.info,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    if (!doc) return next(new AppError('No User found with this ID', 404));
    res.status(200).json({
        status: 'success',
        infoUpdatedUser: doc,
    });
});

exports.updateCart = catchAsync(async (req, res, next) => {
    // console.log(req.body.cart);
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            cart: req.body.cart,
        },
        { new: true, runValidator: true }
    );
    if (!updatedUser) return next(new AppError('No User found with this ID', 404));
    res.json({
        status: 'update cart successfully',
        updatedUser,
    });
});

exports.updateWishlist = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            wishList: req.body.wishList,
        },
        { new: true, runValidator: true }
    );
    if (!updatedUser) return next(new AppError('No User found with this ID', 404));
    res.json({
        status: 'update wishList successfully',
        updatedUser,
    });
});

exports.testFilter = catchAsync(async (req, res, next) => {
    // console.log(req.query);
    const features = new APIFeatures(Accessory.find(), req.query).filter().sort().limitFields().paginate();
    const docs = await features.query;
    res.json({
        status: 'success',
        results: docs.length,
        docs,
    });
});

exports.testSearch = catchAsync(async (req, res, next) => {
    // Lay keywords va type tu request
    // const {keywords, type} = req.body;
    const searchResult = SearchFeature.search(req.query)
    res.json(searchResult)
    // Them sort, filter vao SRP tinh sau
    // viet ham query mongoose, return ket qua json(title, image, descript, gia(neu co) )
})