const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllPosts = catchAsync(async (req, res, next) => {
    const post = await Post.find({}).populate('author', 'name').select('title content author createdAt image');
    res.status(200).json({
        status: 'success',
        results: post.length,
        data: { post },
    });
});

exports.getOnePost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const post = await Post.find({
        _id: postId,
    })
        .populate('author', 'name')
        .select('title content author createdAt image');
    if (!post) return next(new AppError('No Post found with this ID', 404));
    res.status(200).json({
        status: 'success',
        data: post,
    });
});

exports.createOnePost = catchAsync(async (req, res, next) => {
    //console.log(req.user);
    //res.json('sussess')
    const { id } = req.user; // lấy user từ request sau khi giải token từ middleware
    const post = await Post.create({ ...req.body, author: id });
    res.status(201).json({
        status: 'success',
        data: post,
    });
});

exports.updateOnePost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const post = await Post.findByIdAndUpdate(postId, { ...req.body }, { new: true, runValidator: true });
    if (!post) return next(new AppError('No Post found with this ID', 404));
    res.status(200).json({
        status: 'success',
        data: post,
    });
});

exports.deleteOnePost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    //const {userId} = req.user; nhận userID nếu cần
    const post = await Post.findByIdAndDelete(postId);
    if (!post) return next(new AppError('No Post found with this ID', 404));
    res.status(200).json({
        status: 'success',
        message: 'post has been delete',
    });
});
