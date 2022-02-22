const Dog = require('../models/dogSchema')


exports.getRelatedDogs = async function(req, res, next) {
    const {id} = req.params 

    if(!id) return res.status(401).json({error: 'Invalid requests'})

    //  find specific dog 
    const dog = await Dog.findById(id) 

    // if no dog return error response 
    if(!dog) return res.status(404).json({error: 'Not found dog data'})

    // get the related dog based on the dog that we find
    const relatedDogs = await Dog.find(
        {
            tags: {$in: [...dog.tags]}, // chose all the dogs that matches with our already chosen dog (based on tags)
            _id: {$ne: dog._id} // don't add in related dogs those that are already chosen (ne: not equal to)
        }
    )

    res.json({
        dog: relatedDogs.map(dog => ({
            name: dog.name,
            age: dog.age,
            gender: dog.gender,
            color: dog.color,
            slug: dog.slug,
            tag: dog.tags,
            url: dog.thumbnail?.url
        }))
    })

}
