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
    const [pastWeekAppointments, setPastWeekAppointments] = useState()
    const user = JSON.parse(localStorage.getItem('userInfo')).data.name

    const curDate = new Date().getDate()
    let curMonth = new Date().getMonth() +1
    const curYear = new Date().getFullYear()

    if(curMonth.toString().length === 1) {
        curMonth = `0${curMonth}`
    }  
   
    const curDateFull = `${curYear}-${curMonth}-${curDate}`


    useEffect(() => {
        curMonthApt()
        curDayApt()
        dataLastSevenDays()
    })

    function curMonthApt() {
        axios.post('/api/statistic/curmonth/appointments', 
            { month: `${curYear}-${curMonth}` }
        )
        .then(res => {
            setMonthAppointments(res.data)
        })
        .catch(err => {
            setMonthAppointments('server error.')
        })
    }

    function curDayApt() {
        if(curMonth.toString().length === 1) {
            curMonth = `0${curMonth}`
        }

        axios.post('/api/statistic/curdate/appointments', 
            { date: curDateFull }
        )
        .then(res => {
            setTodayAppointments(res.data)
        })
        .catch(err => {
            setTodayAppointments('server error.')
        })
    }

    function dataLastSevenDays() {
        const newDate = new Date()
        let dateLessOneWeek = new Date(newDate.getTime() - (86400000 * 7))
        const [dateOneWeekAgo, ...rest] = dateLessOneWeek.toISOString().split('T')

        axios.post('/api/statistic/pastweek/appointments', 
        { 
            current_date: curDateFull,
            previous_week_date: dateOneWeekAgo
        }
        )
        .then(res => {
            setPastWeekAppointments(res.data)
        })
        .catch(err => {
            setPastWeekAppointments('server error.')
        })
    }

    return (
        <>
            <div className="dashboard-wrapper">
                <h1 className="dashboard-title"> Dashboard </h1>
            </div>
            <div className="dashboard-banner">
                <img src="img/banner_1.jpeg" alt="" />
            </div>
            <div className="dashboard-wrapper">
                <div className="top-stats">
                    <Statistic title="Todays appointments" value={todayAppointments} />
                    <Statistic title="Past seven days" value={pastWeekAppointments} />
                    <Statistic title="Monthly appointments" value={monthAppointments} />
                </div>
            </div>
        </>
    )
}


