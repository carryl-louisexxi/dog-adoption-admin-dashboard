const mongoose = require('mongoose')

const dogSchema = mongoose.Schema({
    name : {
        type: String,
        required: true, 
        trim: true
    },
    age : {
        type: String,
        required: true, 
        trim: true
    },
    gender: {
        type: String,
        required: true, 
        trim: true
    },
    color: {
        type: String,
        required: true, 
        trim: true
    },
    meta: {  // important if we want to have website
        type: String,
        // required: true, 
        // trim: true
    },
    tags: [String],
    author: {
        type: String,
        default: "Admin"
    },
    thumbnail :{
        type: Object,
        url: {
            type: URL,
        },
        public_id: {
            type: String, 
        }
    },
    slug: { // important if we want to have website
        type: String,
        required: true, 
        trim: true,
        unique: true
    }, 
},
{
    timestamps: true // add this if you want to save the date when the post is created
}
)

module.exports = mongoose.model('Dog', dogSchema)