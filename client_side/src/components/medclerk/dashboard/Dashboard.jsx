import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { 
    Statistic
} from 'antd'

import './dashboard.css'

export default function Dashboard() {
    const [monthAppointments, setMonthAppointments] = useState()
    const [todayAppointments, setTodayAppointments] = useState()
    const user = JSON.parse(localStorage.getItem('userInfo')).data.name

    let curMonth = new Date().getMonth() +1
    const curYear = new Date().getFullYear()
    const curDate = new Date().getDate()

    if(curMonth.toString().length === 1) {
        curMonth = `0${curMonth}`
    }

    useEffect(() => {
        curMonthApt()
        curDayApt()
    })

    function curMonthApt() {
        axios.post('http://localhost:8080/api/statistic/curmonth/appointments', 
            { month: `${curYear}-${curMonth}` }
        )
        .then(res => {
            setMonthAppointments(res.data)
        })
    }

    function curDayApt() {
        if(curMonth.toString().length === 1) {
            curMonth = `0${curMonth}`
        }

        axios.post('http://localhost:8080/api/statistic/curdate/appointments', 
            { date: `${curYear}-${curMonth}-${curDate}` }
        )
        .then(res => {
            setTodayAppointments(res.data)
        })
    }

    return (
        <div className="dashboard-wrapper">
            <h1 className="dashboard-user"> Hi, {user}.</h1>
            <div className="top-stats">
                <Statistic title="Todays appointments" value={todayAppointments} />
                <Statistic title="Monthly appointments" value={monthAppointments} />
            </div>
        </div>
    )
}


