import React from 'react'
import PatientRegistration from './PatientRegistration'

import './patient.css'


export default function Patient() {
    return (
        <div className="medclerk-patient-wrapper">
            <h2 className="patient-registration-title">Patient registration form</h2>
            <PatientRegistration />
        </div>
    )
}