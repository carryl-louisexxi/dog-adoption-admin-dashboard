const { isValidObjectId } = require("mongoose")
const Dog = require("../models/dogSchema")
const FeaturedDog = require('../models/featuredDogSchema')
const cloudinary = require('../cloud/cloudinary')

const FEATURED_POST_COUNT = 4

async function addToFeatured(dogID){
    const featuredDogs = await FeaturedDog.find({}).sort({ _id: 1}).exec()

    if(featuredDogs.length == FEATURED_POST_COUNT) 
        await FeaturedDog.findByIdAndDelete(featuredDogs[0]._id) // delete the first featured

    //create new instance of featured dog
    const newFeaturedDog = new FeaturedDog({featured: dogID})
    await newFeaturedDog.save()
}


exports.updateDog = async function(req, res, next){
    const {name, age, gender, color, tags, slug, featured} = req.body
    const {file} = req 
    const {id} = req.params

    //check if the id is valid
    if(!isValidObjectId(id)) return res.status(401).json({error: 'Invalid requests'})

    // check if id exists in database
    const dogData = await Dog.findById(id)
    if(!dogData) return res.status(404).json({error: 'Not found dog data'})

    // check if there is file in the cloud 
    // 1st: check in the database if it has thumbnail 
    const thumbnail_id = dogData.thumbnail?.public_id

    // if exists: delete in the cloud && if there is new thumbnail add it in cloud 
    if(thumbnail_id && file){
        await cloudinary.uploader.destroy(thumbnail_id) //don't delete if there is no file sent to be updated
    }

    if(file){ // add the file sent in cloud 
        const {secure_url, public_id} = await cloudinary.uploader.upload(file.path)
        dogData.thumbnail = ({url: secure_url, public_id})
    }

    //update date
    dogData.name = name
    dogData.age = age 
    dogData.gender = gender 
    dogData.color = color 
    dogData.slug = slug 
    dogData.tags = tags

    // add it to feature if it is featured
    if(featured) await addToFeatured(dogData)
   
    // save the new dogData
    await dogData.save()
}