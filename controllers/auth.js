const Auth = require('../models/auth')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../Config/db')
/**
 * Signup
 */
exports.signup = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 403;
        next(error)
    }
    const { firstname, lastname, email, password, mobile } = req.body
    try {
        const hashPasswod = await bcrypt.hash(password, 12)
        const auth = new Auth({
            firstname,
            lastname,
            email,
            password: hashPasswod,
            mobile
        });
        const result = await auth.save();
        res.status(201).json({
            message: "User Created Successfully",
            success: true,
            userId: result._id
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
}

/**
 * Signin
 */
exports.signin = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 403;
        next(error)
    }
    const { email, password } = req.body
    try {
        const auther = await Auth.findOne({ email: email })
        if (!auther) {
            const error = new Error('User not exist!');
            error.statusCode = 401;
            next(error)
        }
        const passwordVerify = await bcrypt.compare(password, auther.password);
        if (!passwordVerify) {
            const error = new Error('Unauthorized access!');
            error.statusCode = 401;
            next(error)
        }

        const token = jwt.sign({ userId: auther._id, email: auther.email }, config.SECRET_KEY, { expiresIn: '1h' })
        res.status(200).json({
            success: true,
            userId: auther._id,
            token: token
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
}

/**
 * user profile
 */
exports.getProfile = (req, res, next) => {

}

/**
 * Forgot Password
 */
exports.forgotPassword = (req, res, next) => {

}

/**
 * reset password
 */
exports.resetPassword = (req, res, next) => {

}