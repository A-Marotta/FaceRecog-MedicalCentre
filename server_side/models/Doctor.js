const mongoose = require("mongoose")

const DoctorSchema = new mongoose.Schema({
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
    doctor_name: {
        type: String, 
        max: 255,
        required: true     
    },
    isDoctor: {
        type: Boolean,
        default: true
    }
},
    {timestamps: true}
)

module.exports = mongoose.model("Doctor", DoctorSchema)
