import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { Card } from 'antd'
import { Cascader } from 'antd'
import axios from 'axios'

import 'react-calendar/dist/Calendar.css'
import 'antd/dist/antd.css'
import './book-apt.css'

export default function BookAppointment() {
    const [date, setDate] = useState(new Date())
    const [doctorsOnDate, setDoctorsOnDate] = useState([])
    const [doctors, setDoctors] = useState([])

    // const doctors = [
    //     {
    //         value: 'rick',
    //         label: 'rick',
    //         children: [
    //             {
    //               value: '19:30:00',
    //               label: '19:30:00'
    //             },
    //             {
    //               value: '19:45:00',
    //               label: '19:45:00'
    //             }
    //         ],
    //     }
    // ]

    function onChange(value) {
        console.log(value);
    }


    const dateChange = (dateValue) => {
        setDoctorsOnDate([])
        setDate(dateValue)
        let [calendarDate, ...rest] = date.toISOString().split('T')
        calendarDate += 'T00:00:00+10:00'

        axios.post('http://localhost:8080/api/medclerk/reporting/listdoctorsondate', { available_date: calendarDate })
        .then(res => {
            setDoctorsOnDate(res.data.map(doctor => doctor.doctor_name))
            console.log(doctorsOnDate)
            let doctorsAvailable = []
            doctorsOnDate.map(doctor => {
                let doctorObject = {
                    value: doctor,
                    label: doctor
                }
                doctorsAvailable.push(doctorObject)
            })
            setDoctors(doctorsAvailable)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <Card className="book-apt-card" type="inner" title="Book a patient">
            <div className="apt-wrapper">
                <div className="apt-left">
                    <Calendar
                    onChange={dateChange}
                    value={date}
                    />
                </div>
                <div className="apt-right">
                    <Cascader options={doctors} onChange={onChange} placeholder="Please select" />
                </div>
            </div>
        </Card>
    )
}