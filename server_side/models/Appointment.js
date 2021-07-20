const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema({
    doctor_id: {
        type: String,
        required: true
    },
    patient_id: {
        type: String,
        required: true
    },
    availability_id: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    }, 
    end_time: {
        type: String,
        required: true
    }, 
    calendar_id: {
        type: String,
        required: true
    }
},
    {timestamps: true}
)

module.exports = mongoose.model("Appointment", AppointmentSchema)