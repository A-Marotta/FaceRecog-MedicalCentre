import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import { useEffect } from "react"

import Sidebar from "./components/sidebar/Sidebar"
import Topbar from "./components/topbar/Topbar"
import Dashboard from "./components/medclerk/dashboard/Dashboard"
import Doctor from "./components/medclerk/doctor/Doctor"
import Patient from "./components/medclerk/patient/Patient"
import Login from "./pages/login/Login"

import './App.css';

function App() {
    const loggedIn = localStorage.getItem('userInfo')

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    {loggedIn ? <Redirect to="/dashboard" /> : <Login />}
                </Route>

                <div className="content">
                    <Sidebar />
                    <Topbar />

                    <Route exact path="/dashboard">
                        {loggedIn ? <Dashboard /> : <Redirect to="/" />}
                    </Route>
                    <Route exact path="/doctors">
                        {loggedIn ? <Doctor /> : <Redirect to="/" />}
                    </Route>
                    <Route exact path="/patients">
                        {loggedIn ? <Patient /> : <Redirect to="/" />}
                    </Route>
                </div>
            </Switch>
        </Router>
    );
}


export default App;
