const Dog = require('../models/dogSchema')

exports.searchDog =  async function(req, res, next){
    const {name} = req.query

    // check if there is a name query return error if not
    if(!name.trim()) return res.status(401).json({error: 'Search query is missing!'}) 


    // regular expression matches: 
    // A query with an implicit match against a regular expression 
    //is equivalent to a making a query with the $regex operator. 
    const dogs = await Dog.find({name: {$regex: name, $options: 'i'}}) //
    
    res.json({
        dog: dogs.map(dog => ({
            name: dog.name,
            age: dog.age,
            gender: dog.gender,
            color: dog.color,
            slug: dog.slug,
            url: dog.thumbnail?.url
        }))
    })
}