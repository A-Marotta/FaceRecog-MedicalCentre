const router = require('express').Router()
const bcrypt = require('bcrypt')
const multer = require("multer") // acts as a helper when uploading files.
const path = require('path')
const Patient = require("../models/Patient")


const storage = multer.diskStorage({
    destination: `./uploads`,
    filename: (req, file, cb) => {
        const fileName = `1${path.extname(file.originalname)}`
        cb(null, fileName)
    }
});
    
const uploadImage = multer({ storage }).single('photo')
    
// REGISTER
router.post("/patient/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password_digest, salt)

        const newPatient = new Patient({
            email: req.body.email,
            password_digest: hashedPassword,
            patient_name: req.body.patient_name,
            dob: req.body.dob,
            isPatient: true,
            user_img: `/uploads/${req.body.patient_name}`
        })

        const patient = await newPatient.save()
        res.status(200).json(patient)
    } catch(err) {
        console.log(err)
        res.status(404).json(err)
    }
})


// IMAGE UPLOADER
router.post("/patient/uploadimage", uploadImage, async (req, res) => {
    if(req.file) return res.json({msg: 'good job uploading that img'})
})

// LOGIN
router.get("/patient/login", async (req, res) => {
    try {
        const patient = await Patient.findOne({email:req.body.email})
        !patient && res.status(404).json("user email does not exist") 

        const validPassword = await bcrypt.compare(req.body.password_digest, patient.password_digest)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(patient)
    } catch(err) {
        res.status(404).json(err)
    }
})

module.exports = router

//const storage = multer.diskStorage({
    //     destination: `${__dirname}/uploads`,
    //     filename: (req, file, cb) => {
    //         const fileName = `${Date.now()}${path.extname(file.originalname)}`
    //         cb(null, fileName)
    //     }
    // });
     
    // const uploadImage = multer({ storage }).single('photo')
    
    // // REGISTER
    // router.post("/patient/register", uploadImage, async (req, res) => {
    //     console.log(req.body)
    //     // if(req.file) return res.json({msg: 'good job uploading that img'})
        
    //     try {
    //         const salt = await bcrypt.genSalt(10)
    //         const hashedPassword = await bcrypt.hash(req.body.password_digest, salt)
    
    //         const newPatient = new Patient({
    //             email: req.body.email,
    //             password_digest: hashedPassword,
    //             patient_name: req.body.patient_name,
    //             dob: req.body.dob,
    //             isPatient: true,
    //             user_img: `/uploads/${req.body.patient_name}`
    //         })
    
    //         const patient = await newPatient.save()
    //         res.status(200).json(patient)
    //     } catch(err) {
    //         console.log(err)
    //         res.status(404).json(err)
    //     }
    // })