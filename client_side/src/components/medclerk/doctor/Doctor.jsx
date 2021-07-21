import React from 'react'
import DoctorList from './DoctorList'
import BookAppointment from './BookAppointment'
import AddAvailability from './AddAvailability'

import './doctor.css'

export default function Doctor() {
    return (
        <div className="medclerk-doctor-wrapper">
            <DoctorList />
            <BookAppointment />
            <AddAvailability />
        </div>
    )
}
