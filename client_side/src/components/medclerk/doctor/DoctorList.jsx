import React from 'react';
import axios from 'axios'
import { Card } from 'antd';

import 'antd/dist/antd.css';

const tabListNoTitle = [
    {
      key: 'allDoctors',
      tab: 'All doctors',
    },
    {
      key: 'doctorsWorkingToday',
      tab: 'Doctors Working Today',
    }
]

class DoctorList extends React.Component {
    state = {
        doctorTab: 'allDoctors',
        allDoctors: [],
        availableDoctors: []
    }

    componentDidMount() {
        axios.all([
            axios.get(`http://localhost:8080/api/medclerk/reporting/listdoctors`)
                .then(res => {
                    this.setState({ allDoctors: res.data })
            }),
            axios.get(`http://localhost:8080/api/medclerk/reporting/listdoctorstoday`)
                .then(res => {
                    this.setState({ availableDoctors: res.data })
            })
        ])
    }

    onTabChange = (key, type) => {
        this.setState({ [type]: key })
    }

    cardDisplay() {
        if(this.state.doctorTab === 'allDoctors') {
            return <div className="doctor-wrapper"> 
                {this.state.allDoctors.map(doctor => 
                    <div key={doctor._id}className="card">
                        <h4 className="doctor-name">{doctor.doctor_name}</h4>
                        <img className="doctor-img" src={doctor.doctor_img} alt="Avatar"></img>
                        <p className="doctor-email">{doctor.email}</p> 
                    </div>
                )}
            </div>
        } else {
            return <div className="doctor-wrapper"> 
            {this.state.availableDoctors.map(doctor => 
                <div key={doctor._id}className="card-today">
                    <h4 className="doctor-name">{doctor.doctor_name}</h4>
                    <img className="doctor-img" src={doctor.doctor_img} alt="Avatar"></img>
                    <p className="doctor-email">{doctor.email}</p> 
                </div>
            )}
        </div>
        }
        
    }

    render() {
        return (
            <>
                <Card
                    style={{ width: '100%' }}
                    tabList={tabListNoTitle}
                    activeTabKey={this.state.doctorTab}
                    onTabChange={key => {
                        this.onTabChange(key, 'doctorTab')
                    }}
                >
                    {this.cardDisplay()}
                </Card>
            </>
        );
    }
}

export default DoctorList