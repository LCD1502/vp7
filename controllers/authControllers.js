const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // promisify will return a function that return a promise
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    // console.log(token);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions); // set cookie
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        user,
    });
};

exports.signUp = catchAsync(async (req, res, next) => {
    // console.log(req.body);
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
        info: req.body.info,
    });
    createAndSendToken(user, 201, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) check if email and password exist
    ///if (!email || !password) return next(new AppError('Please provide email and password', 400));
    res.json({ email: email, password: password });

    // 2) check if user exists and password are is correct
    // const user = await User.findOne({
    //     email
    // }).select('+password');
    // if (!user)
    //     return next(new AppError('Incorrect email ', 401));
    // if (!await user.correctPassword(password, user.password))
    //     return next(new AppError('Incorrect password', 401));
    // // 3) if everything is ok, send token to client
    // createAndSendToken(user, 200, res);
});

exports.logOut = (req, res) => {
    // set token is 'logged out', set cookie expires after 10 seconds
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: 'success',
    });
};

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // console.log(req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    //3) check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401));
    }

    //4) check if user changed password after the token was issued
    // note - UPDATE LATER

    req.user = freshUser;
    next();

    // res.json({ status: 'protect route', token, freshUser });
});

exports.restrictTo =
    (...role) =>
        (req, res, next) => {
            if (!role.includes(req.user.role)) {
                return next(new AppError('You do not have permission to perform this action', 403));
            }
            next();
        };

exports.updatePasswords = catchAsync(async (req, res, next) => {
    //1) Get user form the collection
    const user = await User.findById(req.user.id).select('+password');

    //2) Check if POSTed current password is correct
    const check = await user.correctPassword(req.body.currentPassword, user.password);
    if (!check) return next(new AppError('Your current password is incorrect', 401));

    //3) If so, update password
    user.password = req.body.newPassword;
    user.passwordConfirmation = req.body.passwordConfirmation;
    await user.save(); // save to run middleware pre 'save' to crypt password

    //4) Log in user, send JWT
    createAndSendToken(user, 200, res);
});

exports.toggleUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('+active');
    if (!user) return next(new AppError('No User found with this ID', 404));
    const newUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            active: !user.active,
        },
        {
            new: true,
        }
    ).select('+active');

    res.json({
        status: 'success',
        newUser,
    });
});
