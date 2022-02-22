const Dog = require('../models/dogSchema')

exports.getDogs = async function(req, res, next){
    const { pageNo = 0, limit = 5 } = req.query  // default page num = 0 , limit = 5

                                            // sort        // limit 10     // skip by 10 every page
    const featuredDogs = await Dog.find({}).sort({ _id: 1}).limit(limit).skip(pageNo * limit).exec()

    res.json({
        posts: featuredDogs.map(dog => ({
            name: dog.name,
            age: dog.age,
            gender: dog.gender,
            color: dog.color,
            tags: dog.tags,
            slug: dog.slug,
            url: dog.thumbnail?.url
        }))
    })

}