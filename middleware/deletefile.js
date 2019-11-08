const fs = require('fs');
const path = require('path')
exports.deleteFile = (filePath) => {
    if (!filePath) {
        return true;
    }

    fs.unlink(filePath, err => {
        return new Error(err)
    });
}