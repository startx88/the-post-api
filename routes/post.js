const fs = require('fs')
const express = require('express');
const mkdirp = require('mkdirp')
const multer = require('multer');
const postController = require('../controllers/post')
const { body } = require('express-validator');
const { isAuth } = require('../middleware/isAuth')
const { fileTypes } = require('../middleware/filetype')

// Router
const router = express.Router();

const Storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const dir = `./uploads/posts/${req.user.userId}`;
        if (!fs.existsSync(dir)) {
            mkdirp.sync(dir, err => {
                if (err) throw new Error('directory not existed');
                cb(null, dir)
            })
        }
        return cb(null, dir)
    },
    filename: async function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: Storage, fileFilter: fileTypes })

// Routes
router.get('/', postController.getPosts);
router.get('/:postId', postController.getPost);
router.post('/add', isAuth, upload.single('image'), [
    body('title', "Title field is required!").not().isEmpty().isLength({ min: 3 }),
    body('description', "Description field is requied!").not().isEmpty().isLength({ min: 3 })
], postController.addPost);
router.put('/update/:postId', isAuth, upload.single('image'), [
    body('title', "Title field is required!").not().isEmpty().isLength({ min: 3 }),
    body('description', "Desdiscriptioncription field is requied!").not().isEmpty().isLength({ min: 3 })
], postController.updatePost);
router.delete('/delete/:postId', isAuth, postController.deletePost);

module.exports = router;