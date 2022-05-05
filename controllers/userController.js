const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Accessory = require('../models/accessoryModel');
const util = require('util')

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.find({
        _id: req.body.id,
    }).select('+active');
    res.json({
        status: 'success',
        message: 'get user successfully',
        user,
    });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find().select('+active');
    res.json({
        status: 'success',
        message: 'get all users successfully',
        users,
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    res.json({
        status: 'success',
        message: 'update me successfully',
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
        message: 'update info successfully',
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
        status: 'success',
        message: 'update cart successfully',
        updatedUser,
    });
});

exports.addItemToCart = catchAsync(async (req, res, next) => {

    const user = await User.findById({ _id: req.user.id }).select('cart')
    let newCart = [...user.cart];
    let check = false;
    let increase;
    async function checkAndUpdate() {
        for (const item of user.cart) {
            if (item.itemId.toString() === req.body.itemId) {
                newCart.forEach(subitem => {
                    if (subitem.itemId.toString() == req.body.itemId) {
                        subitem.quantity += req.body.quantity;
                        return;
                    }
                })
                increase = await User.findByIdAndUpdate({ _id: req.user.id }, {
                    cart: newCart
                }, { new: true, runValidator: true })
                if (!increase) return next(new AppError('No User found with this ID', 404));
                check = true;
                console.log('check 1', check)
                console.log('item.itemId.toString()', item.itemId.toString())
            }
        }

        if (check) {
            return res.json({
                status: 'success',
                message: 'increase cart successfully',
                increase,
            });
        } else {
            const add = await User.findByIdAndUpdate({ _id: req.user.id }, {
                $push: {
                    "cart": [{
                        itemId: req.body.itemId,
                        quantity: req.body.quantity
                    }]
                }
            }, { new: true, runValidator: true })
            if (!add) return next(new AppError('No User found with this ID', 404));
            res.json({
                status: 'success',
                message: 'add cart successfully',
                add,
            });
        }
    }
    checkAndUpdate()
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
        status: 'success',
        message: 'update wishList successfully',
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
