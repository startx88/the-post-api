const express = require('express');
const authController = require('../controllers/auth')
const Auth = require('../models/auth')
const { body } = require('express-validator')
const { isAuth } = require('../middleware/isAuth')
const router = express.Router();

/*** Sign Up */
router.post('/signup', [
    body('firstname', "First name is required!").not().isEmpty(),
    body('firstname', "First name is required!").not().isEmpty(),
    body('email', "First name is required!").isEmail()
        .custom(async (val, { req }) => {
            const isAuther = await Auth.findOne({ email: val });
            if (isAuther) {
                const error = new Error("User already existed")
                error.statusCode = 403
                throw error
            }
            return true
        }),
    body('password', "Password is required!")
        .not().isEmpty()
        .isLength({ min: 6, max: 15 })
        .isAlphanumeric()
        .withMessage("Password will be alpha numeric, length will be min 6 to 15 character long "),
    body('mobile', "Mobile is required!").not().isEmpty(),
], authController.signup)

/*** Sign in */
router.post('/signin', [body('email', "First name is required!").not().isEmpty(),
body('password', "First name is required!").not().isEmpty(),], authController.signin);


/*** Get user profiles */
router.get('/profiles', isAuth, authController.getProfile);


/*** Export the */
module.exports = router;