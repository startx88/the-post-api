exports.fileTypes = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true)
}