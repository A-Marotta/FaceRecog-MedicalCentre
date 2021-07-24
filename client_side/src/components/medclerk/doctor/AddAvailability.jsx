import React, { useState } from 'react'
import axios from 'axios'
import { 
    Card, 
    Divider,
    Input,
    DatePicker,
    Button,
    TimePicker,
    Spin
} from 'antd'
import {
    CheckOutlined,
    StopOutlined
} from '@ant-design/icons'
import { LoadingOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'
import './availability.css'

export default function AddAvailability() {
    const [doctorInfo, setDoctorInfo] = useState()
    const [doctorLoader, setDoctorLoader] = useState()
    const [workingDate, setWorkingDate] = useState()
    const [startTime, setStartTime] = useState()
    const [finishTime, setFinishTime] = useState()
    const [operationSuccess, setOperationSuccess] = useState()
    const [operationFail, setOperationFail] = useState()

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    function handleDoctorSearch(e) {
        setDoctorLoader(true)

        axios.post('/api/doctor/validaccount', { email: e })
            .then(res => {
                if(res.status === 200) {
                    console.log(res.data)
                    setDoctorInfo(res.data)
                }
                setDoctorLoader(false)
            })
    }

    function handleWorkingDate(e) {
        let [date, ...rest] = e.toISOString().split('T')
        setWorkingDate(date)
    }

    function handleStartTimeChange(e) {
        let handleMomentString = e.toString().split(' ')
        let startTime = handleMomentString.slice(-2)
        startTime.pop()
        setStartTime(startTime)
    }

    function handleFinishTimeChange(e) {
        let handleMomentString = e.toString().split(' ')
        let finishTime = handleMomentString.slice(-2)
        finishTime.pop()
        setFinishTime(finishTime)
    }

    function submitWorkingTime() {
        setDoctorLoader(true)
        const doctor_id = doctorInfo._id
        const newStartTime = `${workingDate}T${startTime}+10:00`
        const newFinishTime = `${workingDate}T${finishTime}+10:00`

        axios.post('/api/doctor/availability', 
        { 
            doctor_id: doctor_id,
            start_time: newStartTime,
            end_time: newFinishTime,
        }
        )
        .then(res => {
            setDoctorLoader(false)
            console.log(res)
            if(res.status === 200) {
                setOperationSuccess(true)
            }
        })
        .catch(err => {
            setOperationFail(true)
        })
    }

    const { Search } = Input;
    return (
        <Card className="add-avail-card" type="inner" title="Insert availability">

            <Divider className="divider-padding-top" orientation="left" plain>
                Enter doctor name 
            </Divider>

            {doctorLoader 
                ? <Search placeholder="Please enter doctor email address..." onSearch={handleDoctorSearch} loading />
                : <Search placeholder="Please enter doctor email address..." onSearch={handleDoctorSearch} />
            }

            <Divider className="divider-padding-top" orientation="left" plain>
                Enter working date 
            </Divider>

            <div className="doctor-date-wrapper">
                <DatePicker className="input-doc-date-avail" bordered={false} onChange={handleWorkingDate}/>   
                <TimePicker className="input-doc-date-avail" placeholder="Start Time" onChange={handleStartTimeChange} />
                <TimePicker className="input-doc-date-avail" placeholder="Finish Time" onChange={handleFinishTimeChange} />
            </div>

            <div className="operation-status">
                {workingDate && startTime && finishTime && doctorInfo !== null && doctorInfo !== undefined
                    ? 
                        <Button className="submit-doc-date-avail" type="primary" size={24} onClick={submitWorkingTime}>
                            Submit
                        </Button>
                    :
                        <Button className="submit-doc-date-avail" type="primary" disabled>
                            Submit
                        </Button>
                }
                {doctorLoader ? <Spin className="operation-indicator" indicator={antIcon} /> : ''}
            </div>
        </Card> 
    )
}
