const Post = require('../models/post');
const { validationResult } = require('express-validator');
const { deleteFile } = require('../middleware/deletefile')
/**
 * Get Posts
 */

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('author');
        const count = await Post.find().countDocuments;
        if (!posts) {
            const error = new Error('There is no posts');
            error.statusCode = 404;
            next(error)
        }
        console.log(posts)
        res.status(200).json({
            success: true,
            total: count,
            data: posts.map(item => {
                return {
                    id: item._id,
                    title: item.title,
                    description: item.description,
                    imageUrl: 'https://the-post-api.herokuapp.com/' + item.imageUrl,
                    author: {
                        _id: item.author._id,
                        firstname: item.author.firstname,
                        lastname: item.author.lastname,
                        email: item.author.email,
                        mobile: item.author.mobile
                    },

                    api: {
                        url: 'https://the-post-api.herokuapp.com/api/post' + req.url,
                        method: 'GET'
                    }
                }
            })
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }

}

/**
 * Get Single Post
 */

exports.getPost = async (req, res, next) => {
    const id = req.params.postId;
    console.log(id)
    try {
        const post = await Post.findById(id).populate('author');
        if (!post) {
            const error = new Error('There is no posts');
            error.statusCode = 404;
            next(error)
        }
        res.status(200).json({
            success: true,
            data: {
                id: post._id,
                title: post.title,
                description: post.description,
                imageUrl: 'https://the-post-api.herokuapp.com/' + post.imageUrl,
                author: {
                    _id: post.author._id,
                    firstname: post.author.firstname,
                    lastname: post.author.lastname,
                    email: post.author.email,
                    mobile: post.author.mobile
                },
                api: {
                    url: 'https://the-post-api.herokuapp.com/api/post' + req.url,
                    method: 'GET'
                }
            }
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

/**
 * Add Post
 */

exports.addPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        next(error);
    }
    const title = req.body.title;
    const description = req.body.description;
    let image = req.file;
    try {
        const post = new Post({
            title: title,
            description: description,
            imageUrl: image.path,
            author: req.user.userId
        });
        const result = await post.save();
        res.status(201).json({
            success: true,
            postId: result._id,
            message: "Post inserted successfully!"
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

/**
 * Update Posts
 */

exports.updatePost = async (req, res, next) => {
    const id = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        next(error);
    }


    const existPost = await Post.findById(id);
    if (!existPost) {
        const error = new Error('There is no post by this id');
        error.statusCode = 404;
        next(error);
    }
    let image = req.file;

    try {
        existPost.title = req.body.title;
        existPost.description = req.body.description;
        if (image) {
            deleteFile(existPost.imageUrl);
            existPost.imageUrl = image.path
        }
        const result = await existPost.save();
        res.status(200).json({
            success: true,
            message: 'Post update successfully',
            postId: result._id
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

/**
 * Delete Posts
 */

exports.deletePost = async (req, res, next) => {
    const id = req.params.postId;
    try {
        const post = await Post.deleteOne({ _id: id });
        res.status(200).json({
            success: true,
            message: "Post deleted successfull.",
            postId: post._id
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}