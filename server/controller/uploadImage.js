const cloudinary = require('../cloud/cloudinary')


exports.uploadImage = async function(req, res, next) {
    const {file} = req

    //check if there is a given file
    if(!file) return res.status(401).json({error: 'Image file is missing'})

    //save file image to the cloud: cloudinary host
    const {secure_url} = await cloudinary.uploader.upload(file.path)

    if(!secure_url) return res.status(500).json({error: 'Image file not successfully uploaded'})

    res.status(201).json({image: secure_url})
}