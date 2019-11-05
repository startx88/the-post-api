const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/post')
// Router
const router = express.Router();


// Routes
router.get('/', postController.getPosts);
router.get('/:postId', postController.getPost);
router.post('/add', [
    body('title', "Field is required!").not().isEmpty().isLength({ min: 3 }),
    body('body', "Field is requied!").not().isEmpty().isLength({ min: 3 })
], postController.addPost);
router.put('/update/:postId', [
    body('title', "Field is required!").not().isEmpty().isLength({ min: 3 }),
    body('body', "Field is requied!").not().isEmpty().isLength({ min: 3 })
], postController.updatePost);
router.delete('/delete/:postId', postController.deletePost);


module.exports = router;