const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/** Comment Schema */
const CommentSchema = new Schema({
    title: { type: String, required: true },
    comment: { type: String, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: 'Auther' }],
    post: { type: Schema.Types.ObjectId, ref: 'Post' }
});


module.exports = mongoose.model('Comment', CommentSchema);