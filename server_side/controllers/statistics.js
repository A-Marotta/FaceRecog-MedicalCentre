const router = require('express').Router()
const Appointment = require('../models/Appointment')

// STATISTIC - APPOINTMENT CURRENT MONTH
router.post("/curmonth/appointments", async (req, res) => {
    try{
        const searchMonth = new RegExp(req.body.month, "g")

        const appointments = await Appointment.find(
            {start_time: searchMonth}
        )

        res.status(200).json(appointments.length)
    } catch(err) {
        res.status(404).json(err)
    }
})

// STATISTIC - APPOINTMENT CURRENT DATE
router.post("/curdate/appointments", async (req, res) => {
    try{
        const searchDate = new RegExp(req.body.date, "g")

        const appointments = await Appointment.find(
            {start_time: searchDate}
        )

        res.status(200).json(appointments.length)
    } catch(err) {
        res.status(404).json(err)
    }
})

// STATISTIC - APPOINTMENTS PAST WEEK FROM CURRENT DATE
router.post("/pastweek/appointments", async (req, res) => {
    try{
        const curDate = req.body.current_date += 'T23:59:59+10:00'
        const previousWeekDate = req.body.previous_week_date += 'T00:00:00+10:00'

        const appointments = await Appointment.find({
            start_time: {
                $gt: previousWeekDate,
                $lt: curDate
            }
        })

        res.status(200).json(appointments.length)
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

module.exports = router
