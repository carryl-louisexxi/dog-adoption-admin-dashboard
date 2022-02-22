require('dotenv').config({path: '.env'})
require('express-async-errors')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const router = require('./route/router')
const {errorMiddleware} = require('./middleware/error') // destructure the object coming from exports.

// load data base 
require('./database/connection')

// setup app 
const app = express() 

// setup port 
const port = process.env.PORT || 8000 

// configure app: anything pass in use are middleware
app.use(cors({
    origin: '*'
}))
app.use(express.json()) 
app.use(morgan('dev')) // middleware used as logger
app.use('/api/dogs', router)
app.use(errorMiddleware) // middleware for handling internal server error

// listen to port
app.listen(port, () => {console.log(`Listening to port ${port}`)})
