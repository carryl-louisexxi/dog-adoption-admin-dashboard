const { isValidObjectId } = require('mongoose')
const Dog = require('../models/dogSchema')
const FeaturedDog = require('../models/featuredDogSchema')
const cloudinary = require('../cloud/cloudinary')

async function isFeaturedDog(dogID){
    const featuredData = await FeaturedDog.findOne({featured: dogID})
    return featuredData
}

async function deleteFeaturedDog(featuredDogData){
    await FeaturedDog.deleteOne(featuredDogData)
}

exports.deleteDog = async function(req, res, next){
    const {id} = req.params 

    // check if the id given is correct: handle it
    if(!isValidObjectId(id)) return res.status(401).json({error: 'Invalid requests'})

    // get data from the database 
    const dogData = await Dog.findById(id)

    // handle if dog data does not exits
    if(!dogData) return res.status(404).json({error: 'Not found dog data'})

    // check if there is file image in cloudinary
    const thumbnail_id = dogData.thumbnail?.public_id

    // handle if file exists
    if(thumbnail_id) await cloudinary.uploader.destroy(thumbnail_id) //delete image

    // check if dog data is featured return the data
    const featuredDog = await isFeaturedDog(dogData._id)

    // delete if featured
    if(featuredDog) await deleteFeaturedDog(featuredDog)

    // // delete the file in database
    const {respond, error} = await Dog.deleteOne(dogData)

    if(!error) return res.json({message: 'Successfully deleted dog data'}) 
}