import React from 'react'
import DoctorList from './DoctorList'
import BookAppointment from './BookAppointment'

import './doctor.css'

export default function Doctor() {
    return (
        <div className="medclerk-doctor-wrapper">
            <DoctorList />
            <BookAppointment />
        </div>
    )
}
