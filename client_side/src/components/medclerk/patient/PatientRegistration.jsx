import React, { Component } from 'react'
import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'
import Dashboard from '@uppy/react/lib/Dashboard'
import XHRUpload from '@uppy/xhr-upload'
import { Form, Input, InputNumber, Button } from 'antd'
import axios from 'axios'

import './webcam.css'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import 'antd/dist/antd.css'


const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
}

const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
}

export default class DragAndDropFileUploader extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
    this.handleModalClick = this.handleModalClick.bind(this);

    this.uppy = Uppy({ id: 'uppy1', autoProceed: true, debug: true })
    .use(Webcam)
    .use(XHRUpload, {
        endpoint: '/api/auth/patient/uploadimage',
        fieldName: 'photo',
        formData: true,
    })
  }

  onFinish = (values) => {
     axios({ 
      method: "post",
      data: {
        email: values.user.email,
        password_digest: values.user.password,
        patient_name: values.user.name,
        dob: values.user.dob
      },
      withCredentials: true,
      url: '/api/auth/patient/register'
    })
    }


  componentWillUnmount () {
    this.uppy.close();
  }

  handleModalClick () {
    this.setState({
      open: !this.state.open
    })
  }

    render () {
        const { open } = this.state;

        return (
          <div>
              <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                  <Form.Item
                      name={["user", "name"]}
                      label="Name"
                      rules={[
                          {
                              required: true,
                          },
                      ]}
                  >
                      <Input id="input-width"/>
                  </Form.Item>
      
                  <Form.Item
                      name={["user", "email"]}
                      label="Email"
                      rules={[
                          {
                              type: "email",
                              required: true,
                          },
                      ]}
                  >
                      <Input id="input-width"/>
                  </Form.Item>
      
                  <Form.Item
                      label="Password"
                      name={["user", "password"]}
                      rules={[
                          {
                              required: true,
                              message: "Please input your password!",
                          },
                      ]}
                  >
                      <Input.Password id="input-width"/>
                  </Form.Item>
      
                  <Form.Item
                      name={["user", "dob"]}
                      label="Date of birth"
                      rules={[
                          {
                              required: true,
                          },
                      ]}
                  >
                      <Input id="input-width"/>
                  </Form.Item>
      
                  <Dashboard uppy={this.uppy} target={document.body} plugins={["Webcam"]} trigger="#dashboard" />
                  <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                      <Button type="primary" htmlType="submit">
                          Submit
                      </Button>
                  </Form.Item>
              </Form>
          </div>
      )      
    }
}

