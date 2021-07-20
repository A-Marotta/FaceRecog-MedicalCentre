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
        const doctorsToday = await DoctorAvailablity.find({
            available_date: currentDate
        })

        res.status(200).json(doctorsToday)
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

// List all doctors working on specific date
router.post("/reporting/listdoctorsondate", async (req, res) => {
    // const doctorsWorking = DoctorAvailablity.aggregate([
    //     {
    //         $lookup: {
    //             from: "doctors",
    //             localField: "_id",
    //             foreignField: "doctor_id",
    //             as: "available_doctors"
    //         }
    //     }
    // ])

    try {
        const doctorsWorking = await DoctorAvailablity.find({
            available_date: req.body.available_date
        }).populate('doctor_info')
        // const doctorInfo = await Doctor.find({ 
        //     _id: '60f0fa0d851191a3c740d4d6'
        // })
        // console.log()
    res.status(200).json(doctorsWorking)
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

module.exports = router

// {
//     "_id": "60f2e1100efc2336f0907779",
//     "doctor_id": "60f0fa0d851191a3c740d4d6",
//     "available_date": "2021-07-19T00:00:00+10:00",
//     "start_time": "2021-07-19T16:30:00+10:00",
//     "end_time": "2021-07-19T22:30:00+10:00",
//     "createdAt": "2021-07-17T13:54:24.597Z",
//     "updatedAt": "2021-07-17T13:54:24.597Z",
//     "__v": 0
// }