import React from 'react'
import './topbar.css'

function getToday() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let dateVar = new Date()
    let [day, month, date, ...rest] = dateVar.toString().split(' ')
    month = months[dateVar.getMonth()]

    return `${day} ${month} ${date}`
}

export default function Topbar() {
    const user = JSON.parse(localStorage.getItem('userInfo')).data.name

    return (
        <div className="topbar">
            <div className="topbar-left">
                <span className="welcome-user">Welcome, <span className="user_name">{user}.</span></span>
            </div>
            <div className="topbar-right">
                <div className="date">
                    {getToday()}
                </div>
            </div>
        </div>
    )
}
