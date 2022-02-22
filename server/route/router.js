const { addDog } = require('../controller/addDog')
const { deleteDog } = require('../controller/deleteDog')
const { getDog } = require('../controller/getDog')
const { getFeaturedDogs } = require('../controller/getFeaturedDogs') 
const { updateDog } = require('../controller/updateDog') 
const { getDogs } = require('../controller/getDogs')
const { getRelatedDogs } = require('../controller/getRelatedDogs')
const { uploadImage } = require('../controller/uploadImage')
const { searchDog } = require('../controller/searchDog')
const { dogPostValidator, validate } = require('../middleware/dogPostValidator')
const multer = require('../middleware/multer')
const router = require('express').Router()


/* configure routes */ 

// get dog
router.get('/single/:id', getDog)

// get all dogs 
router.get('/featured-dogs', getFeaturedDogs)

// get dogs
router.get('/all-dogs', getDogs)

// search dog
router.get('/search-dog', searchDog)

// get related posts from the tags 
router.get('/related-dogs/:id', getRelatedDogs)

// post dogs         // multer middleware    //express-validator middleware    // controller
router.post('/add', multer.single('thumbnail'), dogPostValidator, validate, addDog)

// upload image file to cloudinary  
router.post('/upload-image', multer.single('image'), uploadImage)

// update dog      
router.put('/:id', multer.single('thumbnail'), dogPostValidator, validate, updateDog)

// delete dog
router.delete('/:id', deleteDog)

module.exports = router