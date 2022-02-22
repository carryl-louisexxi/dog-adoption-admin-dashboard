const mongoose = require('mongoose')

const featuredDogSchema = mongoose.Schema({
    featured: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Dog', // reference to the dog collection/schema
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('FeaturedDog', featuredDogSchema)