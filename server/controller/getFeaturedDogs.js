const featuredDogSchema = require('../models/featuredDogSchema')
const FeaturedDog = require('../models/featuredDogSchema')


exports.getFeaturedDogs = async function(req, res, next){
    const featuredDogs = await FeaturedDog.find({}).sort({ _id: 1}).populate('featured').exec()

    if(!featuredDogs) return res.json({message: 'There are no featured dogs'})

    res.json({
        post: featuredDogs.map(({featured}) => ({
            name: featured.name,
            age: featured.age,
            gender: featured.gender,
            color: featured.color,
            slug: featured.slug,
            url: featured.thumbnail?.url
        }))
    })

}