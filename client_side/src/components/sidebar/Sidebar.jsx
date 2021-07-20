import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar'
import DashboardIcon from '@material-ui/icons/Dashboard'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import PersonIcon from '@material-ui/icons/Person'
import { Link, useHistory } from 'react-router-dom'

import 'react-pro-sidebar/dist/css/styles.css';
import './sidebar.css'


export default function Sidebar() {
    const history = useHistory()

    return (
        <ProSidebar className="sidebar">
            <SidebarHeader>
                <h3 className="sidebar-title">MedCentre</h3>
            </SidebarHeader>
            <SidebarContent>
                <div className="sidebar-item main-item">
                    <span className="sidebar-icon"><DashboardIcon /></span>
                    <Link to="/dashboard" className="link-to"><h3 className="sidebar-links">Dashboard</h3></Link>
                </div>
                <div className="sidebar-item sub-item">
                    <span className="sidebar-icon"><LocalHospitalIcon /></span>
                    <Link to="/doctors" className="link-to"><h3 className="sidebar-links">Doctors</h3></Link>
                </div>
                <div className="sidebar-item sub-item">
                    <span className="sidebar-icon"><PersonIcon /></span>
                    <Link to="patients" className="link-to"><h3 className="sidebar-links">Patients</h3></Link>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <h3 className="sidebar-footer" onClick={() => {
                    localStorage.removeItem('userInfo')
                    history.push("/")
                    window.location = "/"
                }}>Logout</h3>
            </SidebarFooter>
        </ProSidebar>
    )
}


