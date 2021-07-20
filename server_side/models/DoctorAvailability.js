const mongoose = require("mongoose")

const DoctorAvailablitySchema = new mongoose.Schema({
    doctor_id: {
        type: String,
        required: true
    },
    available_date: {
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
    doctor_info: [{ type: mongoose.Schema.Types.ObjectId, ref:'Doctor' }],
},
    {timestamps: true}
)

module.exports = mongoose.model("DoctorAvailablity", DoctorAvailablitySchema)