import React, { useState } from 'react'
import Calendar from 'react-calendar'
import { 
    Card,
    Cascader,
    Divider,
    Button,
    Input
} from 'antd'
import axios from 'axios'


import 'react-calendar/dist/Calendar.css'
import 'antd/dist/antd.css'
import './book-apt.css'

export default function BookAppointment() {
    const [selectedDate, setSelectedDate] = useState()
    const [doctorList, setDoctorList] = useState([])
    const [selectedAptTime, setSelectedAptTime] = useState()
    const [patientEmail, setPatientEmail] = useState()
    const [patientLoader, setPatientLoader] = useState()
    const [originalDate, setOriginalDate] = useState()

    function onChange(value) {
        setSelectedAptTime(value)
    }

    function handlePatientSearch(e) {
        setPatientLoader(true)

        axios.post('http://localhost:8080/api/patient/validaccount', { email: e })
            .then(res => {
                if(res.status === 200) {
                    setPatientEmail(res.data)
                }
                setPatientLoader(false)
            })
    }
   
    function submitAppointment() {
        let [modifiedDate, ...rest] = originalDate.split('T')
        modifiedDate = `${modifiedDate}T${selectedAptTime[1]}+10:00`

        axios.post('http://localhost:8080/api/patient/appointment', 
            { 
                doctor_id: selectedAptTime[0],
                patient_id: patientEmail._id,
                start_time: modifiedDate
            }
        )
        .then(res => {
            if(res.status === 200) {

                // why the fuck am I doing this
                setPatientEmail(res.data)
            }
            setPatientLoader(false)
        })
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
                setOriginalDate(calendarDate)
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
    const { Search } = Input;
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
                    <Divider orientation="left" plain>
                        Select doctor followed by available time.
                    </Divider>

                    <Cascader options={doctorList} onChange={onChange} placeholder="Please select" />

                    <Divider className="divider-padding-top" orientation="left" plain>
                        Enter patient name 
                    </Divider>

                    {patientLoader 
                        ? <Search placeholder="Please enter patient email address..." onSearch={handlePatientSearch} loading />
                        : <Search placeholder="Please enter patient email address..." onSearch={handlePatientSearch} />
                    }

                    <Divider className="divider-padding-top" orientation="left" plain>
                        Book appointment
                    </Divider>

                    {selectedAptTime && patientEmail
                        ? 
                            <Button type="primary" size={24} onClick={submitAppointment}>
                                Submit
                            </Button>
                        :
                            <Button type="primary" disabled>
                                Submit
                            </Button>
                    }

                </div>
            </div>
        </Card>
    )
}