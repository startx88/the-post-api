const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/post')
const { isAuth } = require('../middleware/isAuth')
// Router
const router = express.Router();

// Routes
router.get('/', postController.getPosts);
router.get('/:postId', postController.getPost);
router.post('/add', isAuth, [
    body('title', "Field is required!").not().isEmpty().isLength({ min: 3 }),
    body('body', "Field is requied!").not().isEmpty().isLength({ min: 3 })
], postController.addPost);
router.put('/update/:postId', isAuth, [
    body('title', "Field is required!").not().isEmpty().isLength({ min: 3 }),
    body('body', "Field is requied!").not().isEmpty().isLength({ min: 3 })
], postController.updatePost);
router.delete('/delete/:postId', isAuth, postController.deletePost);


module.exports = router;