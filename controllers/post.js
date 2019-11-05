const Post = require('../models/post');
const { validationResult } = require('express-validator');

/**
 * Get Posts
 */

exports.getPosts = async (req, res, next) => {
    console.log(req.baseUrl)
    try {
        const posts = await Post.find();
        const count = await Post.find().countDocuments;
        if (!posts) {
            const error = new Error('There is no posts');
            error.statusCode = 404;
            next(error)
        }
        res.status(200).json({
            success: true,
            total: count,
            data: posts.map(item => {
                return {
                    id: item._id,
                    title: item.title,
                    body: item.body,
                    api: {
                        url: 'http://localhost:8080/api/post' + req.url,
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
        const post = await Post.findById(id);
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
                body: post.body,
                api: {
                    url: 'http://localhost:8080/api/post' + req.url,
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
    const { title, body } = req.body;
    console.log(req.body)
    try {
        const post = new Post({
            title: title,
            body: body,
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
    try {
        const existPost = await Post.findById(id);
        existPost.title = req.body.title;
        existPost.body = req.body.body;
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