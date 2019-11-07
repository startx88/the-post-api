exports.fileTypes = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|gif)$/)) {
        const error = new Error('Please slect file one of then png,jpg, gif etc.')
        cb(error, false)
    }
    cb(null, true)
}