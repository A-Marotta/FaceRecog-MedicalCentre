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

    const doctors = [
        {
            value: 'rick',
            label: 'rick',
            children: [
                {
                  value: '19:30:00',
                  label: '19:30:00'
                },
                {
                  value: '19:45:00',
                  label: '19:45:00'
                }
            ],
        }
    ]

    function onChange(value) {
        console.log(value);
    }

    useEffect(() => {
        dateChange(date)
    }, [date])

    const dateChange = (dateValue) => {
        setDate(dateValue)
        let [calendarDate, ...rest] = date.toISOString().split('T')
        calendarDate += 'T00:00:00+10:00'
        console.log(calendarDate)

        axios({ 
            method: "post",
            data: {
                available_date: calendarDate
            },
            url: 'http://localhost:8080/api/medclerk/reporting/listdoctorsondate'
        })
        .then(res => {
            console.log(res)
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
                    onChange={setDate}
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