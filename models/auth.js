const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});


module.exports = mongoose.model('Auther', UserSchema)

