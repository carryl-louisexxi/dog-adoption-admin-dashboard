const mongoose = require('mongoose')

const connectionParams = { 
        useNewUrlParser: true,
        useUnifiedTopology: true
}

mongoose.connect(process.env.MONGODB_URL, connectionParams) // connecting to mongodb
        .then(() => console.log('Connected to database'))
        .catch(error => console.log(error))

