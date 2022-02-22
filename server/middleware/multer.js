const res = require('express/lib/response')
const multer = require('multer')

const storage = multer.diskStorage({}) // used to store files

const fileFilter = function(req, file, cb){ //control which and where files should be uploaded or skipped
    if(!file.mimetype.includes('image')) return cb(new Error('Invalid file format'), false)
    cb(null, true)
}

module.exports = multer({storage: storage, fileFilter: fileFilter})