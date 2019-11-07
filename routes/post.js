const fs = require('fs')
const express = require('express');
const multer = require('multer');
const postController = require('../controllers/post')
const { body, validationResult } = require('express-validator');
const { isAuth } = require('../middleware/isAuth')
const { fileTypes } = require('../middleware/filetype')

// Router
const router = express.Router();

const Storage = multer.diskStorage({

    destination: function (req, file, cb) {
        if (!file.path) {
            return cb(new Error("there is no path"))
        }
        const dir = `./uploads/posts/${req.user.userId}`;
        fs.exists(dir, error => {
            if (!error) {
                return fs.mkdir(dir, err => cb(err, dir))
            }
        })
        return cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: Storage, fileFilter: fileTypes })

// Routes
router.get('/', postController.getPosts);
router.get('/:postId', postController.getPost);
router.post('/add', isAuth, [
    body('title', "Title field is required!").not().isEmpty().isLength({ min: 3 }),
    body('discription', "Description field is requied!").not().isEmpty().isLength({ min: 3 })
], upload.single('image'), postController.addPost);
router.put('/update/:postId', isAuth, [
    body('title', "Title field is required!").not().isEmpty().isLength({ min: 3 }),
    body('discription', "Description field is requied!").not().isEmpty().isLength({ min: 3 })
], upload.single('image'), postController.updatePost);
router.delete('/delete/:postId', isAuth, postController.deletePost);

module.exports = router;