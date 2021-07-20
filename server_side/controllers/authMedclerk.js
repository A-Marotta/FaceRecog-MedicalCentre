const router = require('express').Router()
const bcrypt = require('bcrypt')

const Medclerk = require("../models/Medclerk")
const generateToken = require('../service_objects/generateToken')

// REGISTER - to implement only an admin or medclerk can register a doctor.
router.post("/medclerk/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password_digest, salt)

        const newMedclerk = new Medclerk({
            email: req.body.email,
            password_digest: hashedPassword,
            medclerk_name: req.body.medclerk_name
        })

        const medclerk = await newMedclerk.save()
        res.status(200).json(medclerk)
    } catch(err) {
        res.status(404).json(err)
    }
})

// LOGIN
router.post("/medclerk/login", async (req, res) => {
    try {
        const medclerk = await Medclerk.findOne({email:req.body.email})
        !medclerk && res.status(404).json("user email does not exist") 

        const validPassword = await bcrypt.compare(req.body.password_digest, medclerk.password_digest)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json({
            _id: medclerk._id,
            email: medclerk.email,
            name: medclerk.medclerk_name,
            user_type: 'medclerk',
            token: generateToken(medclerk._id)
        })
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})

module.exports = router