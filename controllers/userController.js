const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Accessory = require('../models/accessoryModel');
const AccessoryBill = require('../models/accessoryBillModel');
const Car = require('../models/carModel');
const CarOrder = require('../models/carOrderModel');
const util = require('util');

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
        message: 'Get me successfully',
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

exports.getCart = catchAsync(async (req, res, next) => {
    // console.log(req.body.cart);
    const cart = req.user.cart;
    res.json({
        status: 'success',
        message: 'get cart successfully',
        cart,
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
    const user = await User.findById({ _id: req.user.id }).select('cart');
    let newCart = [...user.cart];
    console.log('newCart', newCart);
    let check = false;
    let increase;
    async function checkAndUpdate() {
        for (const item of user.cart) {
            if (item.itemId._id.toString() === req.body.itemId && item.color === req.body.color) {
                newCart.forEach((subitem) => {
                    if (subitem.itemId._id.toString() == req.body.itemId) {
                        subitem.quantity += req.body.quantity;
                        return;
                    }
                });
                increase = await User.findByIdAndUpdate(
                    { _id: req.user.id },
                    {
                        cart: newCart,
                    },
                    { new: true, runValidator: true }
                );
                if (!increase) return next(new AppError('No User found with this ID', 404));
                check = true;
            }
        }

        if (check) {
            return res.json({
                status: 'success',
                message: 'increase cart successfully',
                increase,
            });
        } else {
            const add = await User.findByIdAndUpdate(
                { _id: req.user.id },
                {
                    $push: {
                        cart: [
                            {
                                itemId: req.body.itemId,
                                quantity: req.body.quantity,
                                color: req.body.color,
                            },
                        ],
                    },
                },
                { new: true, runValidator: true }
            );
            if (!add) return next(new AppError('No User found with this ID', 404));
            res.json({
                status: 'success',
                message: 'add cart successfully',
                add,
            });
        }
    }
    checkAndUpdate();
});

exports.addItemToWishlist = catchAsync(async (req, res, next) => {
    switch (req.body.type) {
        case 'car': {
            const cars = await User.findById({
                _id: req.user.id,
            }).select('-cart -wishList.accessories -name -email -photo -role -info -_id');
            if (!cars) return next(new AppError('No User found with this ID', 404));
            for (const item of cars.wishList.cars) {
                if (item._id.toString() === req.body.itemId) {
                    return next(new AppError('cannot add car to wish list because it has been exist in wishlist', 400));
                }
            }
            const add = await User.findByIdAndUpdate(
                { _id: req.user.id },
                {
                    $push: {
                        'wishList.cars': [req.body.itemId],
                    },
                },
                { new: true, runValidator: true }
            );
            if (!add) return next(new AppError('No User found and cannot add car with this ID', 404));
            return res.json({
                status: 'success',
                message: 'add car item to wishlist successfully',
                cars: add.wishList.cars,
            });
        }
        case 'accessory': {
            const acc = await User.findById({
                _id: req.user.id,
            }).select('-cart -wishList.cars -name -email -photo -role -info -_id');
            if (!acc) return next(new AppError('No User found with this ID', 400));
            for (const item of acc.wishList.accessories) {
                if (item._id.toString() === req.body.itemId) {
                    return next(
                        new AppError('cannot add accessory to wish list because it has been exist in wishlist', 400)
                    );
                }
            }
            const add = await User.findByIdAndUpdate(
                { _id: req.user.id },
                {
                    $push: {
                        'wishList.accessories': [req.body.itemId],
                    },
                },
                { new: true, runValidator: true }
            );
            if (!add) return next(new AppError('No User found and cannot add accessory with this ID', 404));
            return res.json({
                status: 'success',
                message: 'add accessory item to wishlist successfully',
                accessories: add.wishList.accessories,
            });
        }
        default:
            return next(new AppError('wrong or empty "type"', 400));
    }
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

exports.adminData = catchAsync(async (req, res, next) => {
    const user = await User.find({
        role: 'user'
    }).select(' -cart -wishList -email -photo -info -role')
    if (!user) return next(new AppError('No User found', 404));
    const order = await CarOrder.find().select('-userInfo -carInfo.image')
    if (!order) return next(new AppError('Order error', 404));
    const bill = await AccessoryBill.find().select('-itemId.image -itemId.specification -itemId.description')
    if (!bill) return next(new AppError('Bill error', 404));
    //tra ve so luong nguoi dung, tong don hang, tong doanh thu
    res.json({
        status: 'success',
        user: user,
        carOrder: order,
        accessoryBill: bill
    });
});

exports.adminDataCountOrder = catchAsync(async (req, res, next) => {
    const countOrder = await CarOrder
        .aggregate([{
            "$group":
            {
                "_id": { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_at"} },

                //time: '$time',
                "total_order": { "$count": {} }
            }
        }]).sort("_id")
    if (!countOrder) return next(new AppError('Count Order error', 404));
    res.json({
        status: 'success',
        countOrder:countOrder,
    });
});

exports.adminDataCountBill = catchAsync(async (req, res, next) => {
    const countBill = await AccessoryBill
        .aggregate([{
            $group:
            {
                "_id": { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_at"} },
                total_order: { $count: {} }
            }
        }]).sort("_id")
    if (!countBill) return next(new AppError('Count Bill error', 404));
    res.json({
        status: 'success',
        countBill:countBill,
    });
});