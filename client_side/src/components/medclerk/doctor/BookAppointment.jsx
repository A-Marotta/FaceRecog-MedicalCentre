import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { Card } from 'antd'
import { Cascader } from 'antd'
import axios from 'axios'

import 'react-calendar/dist/Calendar.css'
import 'antd/dist/antd.css'
import './book-apt.css'

export default function BookAppointment() {
    const [selectedDate, setSelectedDate] = useState()
    const [doctorList, setDoctorList] = useState([])

    function onChange(value) {
        console.log(value);
    }

    const newDate = (dateValue) => {
        setDoctorList()

        const newDate = new Date(dateValue)
        let followingDay = new Date(newDate.getTime() + (86400000 * 1))
        let [calendarDate, ...rest] = followingDay.toISOString().split('T')
        calendarDate += 'T00:00:00+10:00'

        setSelectedDate(calendarDate)
        
        axios.post('http://localhost:8080/api/medclerk/reporting/listdoctorsondate', { available_date: calendarDate })
            .then(res => {

                let doctorsAvailable = []

                res.data.forEach(doctor => {
                    let doctorObject = {
                        value: doctor._id,
                        label: doctor.doctor_name
                    }

                    doctorsAvailable.push(doctorObject)
                })

                return doctorsAvailable
            })
            .then(res => {
                const [newDate, ...rest] = calendarDate.split('T')
                let docArray = []
                res.forEach(available_doctor => {
                    axios.post('http://localhost:8080/api/patient/checkavailapt', { 
                        start_time: newDate, 
                        doctor_id: available_doctor.value 
                    })
                    .then(res => {
                        let timeSlots = []

                        res.data.forEach(timeslot => {
                            timeslot = timeslot.split('T')[1]
                            timeslot = timeslot.split('+')[0]

                            let timeObject = {
                                value: timeslot,
                                label: timeslot
                            }

                            timeSlots.push(timeObject)
                        })
                        available_doctor.children = timeSlots
                        docArray.push(available_doctor)
                    })
                })
                setTimeout(function () {
                    setDoctorList(docArray.map(doctor => doctor))
                }, 1000);
            })
    }

    return (
        <Card className="book-apt-card" type="inner" title="Book a patient">
            <div className="apt-wrapper">
                <div className="apt-left">
                    <Calendar
                    onChange={newDate}
                    value={new Date()}
                    />
                </div>
                <div className="apt-right">
                    <Cascader options={doctorList} onChange={onChange} placeholder="Please select" />
                </div>
            </div>
        </Card>
    )
}