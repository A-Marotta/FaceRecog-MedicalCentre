const router = require('express').Router()

const Doctor = require('../models/Doctor')
const DoctorAvailablity  = require('../models/DoctorAvailability')

const createCalendarAvailablity = require('../service_objects/gcal_createAvailability')


// DOCTOR ADD AVAILABILITY
router.post("/availability", async (req, res) => {
    const doctorID = req.body.doctor_id
    const start = req.body.start_time
    const end = req.body.end_time
    let [date_of_work, time] = start.split('T')
    date_of_work += 'T:00:00:00+10:00'
    
    try {
         const newAvailability = new DoctorAvailablity({
            doctor_id: doctorID,
            available_date: date_of_work,
            start_time: start, 
            end_time: end 
        })

        const availability = await newAvailability.save()
        const doctor = await Doctor.findOne({_id:doctorID})
        setTimeout(function () {
            createCalendarAvailablity(doctor.doctor_name, doctor.email, start, end)
        }, 2000);
        

        res.status(200).json(availability)
    } catch(err) {
        res.status(404).json(err)
    }
})

// DOCTOR DELETE AVAILABILITY
router.delete("/:id", async(req, res) => { 
    try {
        const availability = await DoctorAvailablity.findById(req.params.id)

        if(availability.doctor_id === req.body.doctor_id) {
            await availability.deleteOne()
            res.status(200).json("the availability has been deleted.")
        } else {
            res.status(403).json("You can only delete availablility that belongs to your account.")
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router
