const Dog = require('../models/dogSchema')
const FeaturedDogs = require('../models/featuredDogSchema')
const cloudinary = require('../cloud/cloudinary')
const { isValidObjectId } = require('mongoose')
const res = require('express/lib/response')

const FEATURED_POST_COUNT = 4

async function addToFeaturedDogs(dogId){
    const featuredDogs = await FeaturedDogs.find({}).sort({ _id: 1 }).exec()

    if(featuredDogs.length == FEATURED_POST_COUNT) 
        await FeaturedDogs.findByIdAndDelete(featuredDogs[0]._id)
    
    const featuredDog = new FeaturedDogs({featured: dogId})
    await featuredDog.save()
}

// get dogs
exports.checkDog = async function(req, res, next){
    const {id} = req.params

    // get the dog from database 
    if(!isValidObjectId(id)) return res.status(401).json({error: 'Invalid ID'}) 

    // get the object in the database 
    const dogData = await Dog.findById(id)

    // if not in database 
    if(!dogData) return res.status(404).json({error: 'Dog data not found'})

    // return the dog data 
    res.send(dogData)
}

// post dogs 
exports.addDog = async function(req, res, next){
    const file = req.file // returned callback of the multer is now in the req.file
    const {name, age, gender, color, tags, slug, featured} = req.body // destructor the req sent 

    //if file already exist then handle it
    const slugExists = await Dog.findOne({slug})

    if(slugExists) return res.json({error: 'Dog already exists'})

    const newDog = new Dog({name, age, gender, color, tags, slug}) // create new instance of the Dog Schema Model    
    
    if(file){ // upload file image to cloudinary
        const {secure_url, public_id} = await cloudinary.uploader.upload(file.path) // get the url and id generated after uploading
        newDog.thumbnail = {url: secure_url, public_id} // save result to our database
    }
    
    await newDog.save().then(result => res.json(result)) 

    if(featured) await addToFeaturedDogs(newDog)
}

// delete dog 
exports.deleteDog = async function(req, res, next){
    const {id} = req.params

    // check if the id is valid 
    if(!isValidObjectId(id)) return res.status(401).json({error: 'Invalid ID'}) // Unauthorized

    // get the object in the database
    const dogData = await Dog.findById(id)

    // if not in the database
    if(!dogData) return res.status(404).json({error: 'Dog data not found'})

    // delete in cloudinary
    const public_id = dogData.thumbnail?.public_id
    if(public_id) await cloudinary.uploader.destroy(public_id)

    // delete in database
    await Dog.deleteOne(dogData)

    // delete in featured dogs
    const isFeaturedDog = await FeaturedDogs.findOne({featured: dogData._id})
    if(isFeaturedDog) await FeaturedDogs.deleteOne({featured: dogData._id})
    
    // send successful delete message 
    res.json({message: 'Successfully delete data'})
}
