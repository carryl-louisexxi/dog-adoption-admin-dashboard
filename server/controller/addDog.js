const Dog = require('../models/dogSchema')
const FeaturedDog = require('../models/featuredDogSchema')
var cloudinary = require('../cloud/cloudinary')

const FEATURED_POST_COUNT = 4

async function addToFeatured(dogID){
    const featuredDogs = await FeaturedDog.find({}).sort({ _id: 1}).exec()

    if(featuredDogs.length == FEATURED_POST_COUNT) 
        await FeaturedDog.findByIdAndDelete(featuredDogs[0]._id) // delete the first featured

    //create new instance of featured dog
    const newFeaturedDog = new FeaturedDog({featured: dogID})
    await newFeaturedDog.save()
}


exports.addDog = async function(req, res, next){
    const {file} = req
    const {name, age, gender, color, tags, slug, featured} = req.body

    // handle if slug exists
    const isSlugExists = await Dog.findOne({slug})
    if(isSlugExists) return res.json({error: 'Slug already exists'})

    //create new instance of Dog 
    const newDog = new Dog({name, age, gender, color, tags, slug})

    if(file){
        //save file image to the cloud: cloudinary host
        const {secure_url, public_id} = await cloudinary.uploader.upload(file.path)

        //add the url and id to the dog instance
        newDog.thumbnail = ({url: secure_url, public_id})
    }

    //save the created dog data to the database 
    const {respond, error} = await newDog.save()

    //add to featured dog collection if featured is true 
    if(featured) await addToFeatured(newDog)

    // successful saved data message
    if(!error) res.json({message: 'Successfully saved dog data'})

}