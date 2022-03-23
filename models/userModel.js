const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    photo: {
        type: String,
        default: 'default.png',
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minLength: 8,
        select: false,
    },
    passwordConfirmation: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            // this only work on CREATE and SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Your password confirmation are not same',
        },
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});
// userSchema.plugin(uniqueValidator);

// middleware to crypt password
userSchema.pre('save', async function (next) {
    // only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    // HASH  with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    //delete passwordConfirmation field
    this.passwordConfirmation = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
