const mongoose = require("mongoose")

const PatientSchema = new mongoose.Schema({
    email: {
        type: String, 
        max: 50,
        lowercase: true, 
        unique: true, 
        required: [true, "can't be blank"], 
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true
    },
    password_digest: {
        type: String,
        required: true,
        min: 6
    },
    patient_name: {
        type: String, 
        max: 255,
        required: true     
    },
    dob: { 
        type: String,
        required: true  
    },
    mobile: {
        type: String, 
        max: 50,
    },
    state: {
        type: String, 
        max: 255
    },
    city: {
        type: String, 
        max: 255
    },
    postcode: {
        type: String, 
        max: 6
    },
    address: {
        type: String, 
        max: 255
    },
    isPatient: {
        type: Boolean,
        default: true
    },
    user_img: {
        type: String,
        required: true
    }
},
    {timestamps: true}
)

module.exports = mongoose.model("Patient", PatientSchema)