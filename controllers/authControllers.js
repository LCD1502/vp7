const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
    });
    createAndSendToken(user, 201, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) check if email and password exist
    if (!email || !password) return next(new AppError('Please provided email and password', 400));
    // res.json({ email: email, password: password });

    // 2) check if user exists and password are is correct
    const user = await User.findOne({ email }).select('+password');
    console.log(user.password);
    if (!user || !user.correctPassword(password, user.password))
        return next(new AppError('Incorrect email or password', 401));

    // 3) if everything is ok, send token to client
    createAndSendToken(user, 200, res);
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

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.find({
        _id: req.body.id,
    });
    res.json({
        user,
    });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.json({
        users,
    });
});
