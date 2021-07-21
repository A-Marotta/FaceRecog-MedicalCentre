const router = require('express').Router()

const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const Availability = require('../models/DoctorAvailability')

const createGoogleCalendarAppointment = require('../service_objects/gcal_createAppointment')
const deleteGoogleCalEvent = require('../service_objects/gcal_deleteAppointment')
const sendEmail = require("../service_objects/nodemailer");

const moment = require("moment")

function intervals(startTime, endTime) {
    var start = moment(startTime);
    var end = moment(endTime);

    start.minutes(Math.ceil(start.minutes() / 15) * 15);

    var result = [];

    var current = moment(start);

    while (current <= end) {
        result.push(current.format('YYYY-MM-DDTHH:mm:ss+10:00'));
        current.add(15, 'minutes');
    }
    result.pop()
    return result;
}

// PATIENT CHECK IF DOCTOR IS WORKING ON THAT DAY
router.get('/checkavail', async (req,res) => {
    try {
        const searchDate = new RegExp(req.body.available_date)

        const available = await Availability.findOne({ 
            available_date: searchDate, 
            doctor_id: req.body.doctor_id
        })

        res.status(200).json(available)
    } catch(err){
        console.log(err)
        res.status(404).json(err)
    } 
})

// PATIENT CHECK DOCTOR AVAILABLE APPOINTMENTS FOR SPECIFIC DAY
router.post('/checkavailapt', async (req,res) => {
    try {
        const searchDate = new RegExp(req.body.start_time, "g")

        const appointments = await Appointment.find({ 
                // YYYY-MM-DD
                start_time: searchDate,
                doctor_id: req.body.doctor_id
        })

        const available = await Availability.findOne({ 
            available_date: searchDate, 
            doctor_id: req.body.doctor_id
        })

        // Push to array the exising bookings that can no longer be used
        const appointmentTimes = []
        appointments.map(appointment => appointmentTimes.push(appointment.start_time))

        // Using the start and end times, how many booking spots are there to choose from?
        const appointmentIntervals = intervals(available.start_time, available.end_time)

        // Return the remaining available booking times
        const availableSlots = appointmentIntervals.filter(interval => appointmentTimes.indexOf(interval) === -1 )
        
        res.status(200).json(availableSlots)
    } catch(err){
        console.log(err)
        res.status(404).json(err)
    } 
})

// PATIENT BOOK AN APPOINTMENT WITH A DOCTOR
router.post("/appointment", async (req,res) => {
    const startTime = req.body.start_time
    const doctorID = req.body.doctor_id
    const patientID = req.body.patient_id

    let endTime = moment(startTime)
        .add(15, 'm')
        .utc('10')
        .toISOString()
        .split('.')

    let removeMomentOffdefault = endTime.pop()
    endTime += '+10:00'
    
    try {
        let [date_of_apt, time] = startTime.split('T')
        const searchDate = new RegExp(date_of_apt)

        const available = await Availability.findOne({ 
            available_date: searchDate, 
            doctor_id: doctorID
        })

        if(available !== null)
        {
            const doctor = await Doctor.findOne({_id:doctorID})
            const patient = await Patient.findOne({_id:patientID})
            const eventCreated = await createGoogleCalendarAppointment(doctor.doctor_name, doctor.email, patient.patient_name, patient.mobile, startTime, endTime)
    
            if(eventCreated) {
                const newAppointment = new Appointment({
                    doctor_id: doctorID,
                    patient_id: patientID,
                    availability_id: req.body.availability_id,
                    start_time: startTime,
                    end_time: endTime,
                    calendar_id: eventCreated.event_id
                })
    
                const appointment = newAppointment.save()
    
                res.status(200).json(newAppointment)
            }  
        } else {
            res.status(404).json('doctor not available on specified day')
        }
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

// PATIENT DELETE AN APPOINTMENT WITH A DOCTOR
router.delete("/appointment/:id", async (req,res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
        const doctor = await Doctor.findOne({_id:appointment.doctor_id})

        if(appointment.patient_id === req.body.patient_id) {
            const eventDelete = await deleteGoogleCalEvent(appointment.calendar_id, doctor.email)

            if(eventDelete) {
                await appointment.deleteOne()

                res.status(200).json("the appointment has been deleted")
            }
        } else {
            res.status(403).json("You can only delete appointments that belong to you")
        }
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

// PATIENT ARRIVAL TO CLINIC 
router.post("/arrival", async (req, res) => {
    try{
        await sendEmail(`Patient arrival: ${req.body.name}`, `Patient ${req.body.name} has arrived at ${req.body.time}, please notify the appropriate doctor.`)
        res.status(200).json('success')
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

module.exports = router