const mongoose = require('mongoose') // mongoDB object modeling tool to work in an asynchronous environment.

// configuration for connection to mongodb 
const db = mongoose.connect(process.env.MONGO_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, 
    () => {
    console.log("Connected to MongoDB");
    }
)

module.exports = db