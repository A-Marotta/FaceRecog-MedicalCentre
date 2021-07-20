const router = require('express').Router()
const bcrypt = require('bcrypt')

const Doctor = require("../models/Doctor")

// REGISTER - to implement only a medclerk can register a doctor.
router.post("/doctor/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password_digest, salt)

        const newDoctor = new Doctor({
            email: req.body.email,
            password_digest: hashedPassword,
            doctor_name: req.body.doctor_name
        })

        const doctor = await newDoctor.save()
        res.status(200).json(doctor)
    } catch(err) {
        res.status(404).json(err)
    }
})

// LOGIN
router.get("/doctor/login", async (req, res) => {
    try {
        const doctor = await Doctor.findOne({email:req.body.email})
        !doctor && res.status(404).json("doctor email does not exist") 

        const validPassword = await bcrypt.compare(req.body.password_digest, doctor.password_digest)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(doctor)
    } catch(err) {
        res.status(404).json(err)
    }
})

module.exports = router