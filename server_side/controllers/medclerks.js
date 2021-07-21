const router = require('express').Router()

const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const DoctorAvailablity  = require('../models/DoctorAvailability')

const moment = require('moment')

// REPORTING - How many patients doctor has seen for specific day
router.get("/reporting/docperday/:id", async (req, res) => {
    try {
        const searchDate = new RegExp(req.body.start_time, "g")

        const appointments = await Appointment.find({ 
                // YYYY-MM-DD
                start_time: searchDate,
                doctor_id: req.params.id
        })

        res.status(200).json(appointments.length)
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

// REPORTING - How many patients doctor has seen for specific month
router.get("/reporting/docpermonth/:id", async (req, res) => {
    try {
        const searchMonth = new RegExp(req.body.start_time, "g")

        const appointments = await Appointment.find({ 
                // YYYY-MM
                start_time: searchMonth,
                doctor_id: req.params.id
        })

        res.status(200).json(appointments.length)
    } catch(err) {
        res.status(404).json(err)
    }
})

// List all doctors in clinic
router.get("/reporting/listdoctors", async (req, res) => {
    try {
        const doctors = await Doctor.find()

        res.status(200).json(doctors)
    } catch(err) {
        res.status(404).json(err)
    }
})

// List all doctors working on todays date
router.get("/reporting/listdoctorstoday", async (req, res) => {
    let currentDate = moment().toISOString().split('T')[0]
    currentDate += 'T00:00:00+10:00'

    try {
        let doctorNames

        DoctorAvailablity.find({ available_date: currentDate }).exec(function(err,results) {
            var ids = results.map(function(el) { return el.doctor_id } )

            Doctor.find({ "_id": { "$in": ids }},function(err,items) {
                doctorNames = items
            })
        })
        
        setTimeout(function () {
            res.status(200).json(doctorNames)
        }, 2000);
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

// List all doctors working on specific date
router.post("/reporting/listdoctorsondate", async (req, res) => {
    try {
        let doctorNames

        DoctorAvailablity.find({ available_date: req.body.available_date },{ "doctor_id": 1}).exec(function(err,results) {
            var ids = results.map(function(el) { return el.doctor_id } )

            Doctor.find({ "_id": { "$in": ids }},{"doctor_name": 1},function(err,items) {
                doctorNames = items
            })
        })
        
        setTimeout(function () {
            console.log(doctorNames)
            res.status(200).json(doctorNames)
        }, 2000);
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

module.exports = router