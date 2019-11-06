const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post Schema
const PostSchema = new Schema({
    title: { type: String, required: true },
    discription: { type: String, required: true },
    imageUrl: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Auther' }
}, {
    timestamps: true
})

const Post = module.exports = mongoose.model('Post', PostSchema)