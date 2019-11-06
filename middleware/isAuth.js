const jwt = require('jsonwebtoken');
const config = require('../Config/db')
exports.isAuth = (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        next(error);
    }
    const token = header.split(' ')[1];
    if (!token) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        next(error);
    }
    let isVerify;
    try {
        isVerify = jwt.verify(token, config.SECRET_KEY);
    } catch (error) {
        next(error);
    }
    if (!isVerify) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        next(error);
    }
    req.user = isVerify
    next()
}