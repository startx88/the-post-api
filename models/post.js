const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post Schema
const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true }
}, {
    timestamps: true
})

const Post = module.exports = mongoose.model('Post', PostSchema)