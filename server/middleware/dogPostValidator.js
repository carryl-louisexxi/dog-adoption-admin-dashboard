const {check, validationResult} = require('express-validator') 

exports.dogPostValidator = [  // checking if every field required is there
    check('name').trim().not().isEmpty().withMessage('Name field missing!'), // required and return message if empty
    check('age').trim().not().isEmpty().withMessage('Age field missing!'),
    check('gender').trim().not().isEmpty().withMessage('Gender field missing!'),
    check('color').trim().not().isEmpty().withMessage('Color field missing!'),
    //check('meta').trim().not().isEmpty().withMessage('Meta field missing!'),
    check('slug').trim().not().isEmpty().withMessage('Slug field missing!'),
    check('tags')  // mandatory
        .isArray()
        .withMessage('Tag must be array of string!')
        .custom(tags => {
            for(let tag of tags) 
                if(typeof tag !== 'string') throw Error('Tag must be string!')
            return true
        })
]

exports.validate = function(req, res, next) { // validating result
    const error = validationResult(req).array() // read all the error messages

    if(error.length) return res.status(401).json({error: error[0].msg}) // return what field is missing

    next()
}