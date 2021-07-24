import React, { useState } from 'react'
import axios from 'axios'

import './login.css'

export default function Login() {
    const loggedIn = localStorage.getItem('userInfo')
    const [loginUsername, setLoginUsername] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)

        axios({ 
            method: "post",
            data: {
                email: loginUsername, 
                password_digest: loginPassword 
            },
            withCredentials: true,
            url: '/api/auth/medclerk/login'
        })
        .then(res => {
            setLoading(false)
            console.log(res)
            localStorage.setItem('userInfo', JSON.stringify(res))
            if (res.status == 200) {
                window.location = "/dashboard" 
            }
        })
        .catch(err => {
            setLoading(false)
            setError(err)
        })
        
    }   

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-left"></div>
                <div className="login-right">
                        <h1 className="login-welcome">MedCentre</h1>
                        <span className="login-text">Welcome back!</span>
                        <span className="login-text">please login to view todays schedule.</span> 
                        <form className="login-form" onSubmit={handleLogin}>
                            <input className="login-input" type="email" placeholder="Email address" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required/>
                            <input className="login-input" type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required/>
                            <button className="login-btn" type="submit">Log in</button>
                        </form>
                </div>
            </div>
        </div>
    )
}

