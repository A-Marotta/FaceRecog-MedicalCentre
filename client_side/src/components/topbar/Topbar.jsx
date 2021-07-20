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
    return (
        <div className="topbar">
            <div className="topbar-left">
                <span className="date">{getToday()}</span>
            </div>
            <div className="topbar-right">
                <div className="profile">
                    <img src="http://placekitten.com/200/300" alt="" />
                </div>
            </div>
        </div>
    )
}
