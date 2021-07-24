// Imports
const express = require('express')
const app = express() 
const port = process.env.PORT || 8080

const dotenv = require('dotenv') // separate the vulnerable data e.g. secret keys
dotenv.config()

const logger = require('./middlewares/logger.js') // logger middleware
const helmet = require('helmet') // securing requests
var cors = require('cors') // due to api requests blocked by CORS policy
const router = express.Router()
const path = require("path")
const db = require ('./db/db.js')

//--------------------------------------- END OF IMPORTS ---------------------------------------



// Middleware
app.use(logger)
app.use(cors({
    origin: 'https://tranquil-springs-32742.herokuapp.com/',
    credentials: true
})) 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//--------------------------------------- END OF MIDDLEWARE ---------------------------------------

// Routes
const authPatientRoute = require("./controllers/authPatient.js")
const authDoctorRoute = require("./controllers/authDoctor.js")
const authMedclerkRoute = require("./controllers/authMedclerk.js")

const patientsRoute = require("./controllers/patients.js")
const doctorRoute = require("./controllers/doctors.js")
const medclerkRoute = require("./controllers/medclerks.js")

const statisticRoute = require("./controllers/statistics.js")

app.use("/api/auth", authPatientRoute)
app.use("/api/auth", authDoctorRoute)
app.use("/api/auth", authMedclerkRoute)

app.use("/api/patient", patientsRoute)
app.use("/api/doctor", doctorRoute)
app.use("/api/medclerk", medclerkRoute)

app.use("/api/statistic", statisticRoute)

//--------------------------------------- END OF ROUTES ---------------------------------------

app.listen(port, () => {
    console.log(`magic happening at port: ${port}`)
})

if (process.env.NODE_ENV === 'production') {
    const path = require('path')
    app.use(express.static(path.join(__dirname, 'build')));
  
    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
  }