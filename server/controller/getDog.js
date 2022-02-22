const { isValidObjectId } = require("mongoose")
const Dog = require('../models/dogSchema')


exports.getDog = async function(req, res, next){
    const {id} = req.params 

    //check if id is valid 
    if(!isValidObjectId(id)) return res.status(401).json({error: 'Invalid requests'})

    //check if id is in database 
    const dogData = await Dog.findById(id)

    // return error if not in database
    if(!dogData) return res.status(404).json({error: 'Not found dog data'})

    // return the data 
    res.json(
        {
            dog: {
                name: dogData.name,
                age: dogData.age,
                gender: dogData.gender,
                color: dogData.color,
                slug: dogData.slug,
                tags: dogData.tags,
                thumbnail_url: dogData.thumbnail?.url,
                date_created: dogData.createdAt
            }
        })
}