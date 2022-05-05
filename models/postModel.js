const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: { type: String, trim: true, required: [true, 'Post must have content'] },
    title: { type: String, trim: true, required: [true, 'Post must have title'] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: {
        avatar:{type:String ,required: [true, 'Post must have avatar']},
        banner:{type:String, required: [true, 'Post must have banner'],},    
    },
}, { timestamps: true })


const Post = mongoose.model('Post', postSchema);
module.exports = Post;