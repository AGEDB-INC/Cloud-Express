import React from 'react';
import './serverconnection.css'; // Import your CSS file

import {
  Button, Col, Form, Input, InputNumber, Row,
} from 'antd';

const ServerConnectionModal = () => {
  function openModal() {
    document.getElementById('serverConnectionModal').style.display = 'flex';
    document.getElementById('serverConnectionBtn').style.display = 'none';
  }

  const connectToDatabase = () => {
    document.getElementById('serverConnectionModal').style.display = 'none';
    document.getElementById('serverConnectionBtn').style.display = 'flex';
  };

  const closeModal = () => {
    document.getElementById('serverConnectionModal').style.display = 'none';
    document.getElementById('serverConnectionBtn').style.display = 'flex';
  };

  const FormInitialValue = {
    database: '',
    graph: '',
    host: '',
    password: '',
    port: null,
    user: '',
  };

  return (
    <div style={{ zIndex: '2px', position: 'relative' }}>
      <button
        id="serverConnectionBtn"
        type="button"
        onClick={openModal}
        className="connection-button"
      >
        Connect Database
      </button>
      <div style={{ marginTop: '120%', marginLeft: '-130%' }} id="serverConnectionModal" className="Modal">
        <div className="serverConnectionModal-content" style={{ height: '600px', width: '600px' }}>
          <div className="div-style" style={{ height: '120px' }}>
            <h2 className="first-heading" style={{ marginLeft: '40px' }}>
              Connection
            </h2>
            <p className="serverConnection-paragraph" style={{ color: 'blue' }}>
              Connect to Database.
            </p>
          </div>

          <div>
            <div>
              <Row>
                <Col span={18}>
                  <div className="FrameWrapper">
                    <Form
                      initialValues={FormInitialValue}
                      layout="vertical"
                      style={{ width: '500px' }}
                      onFinish={connectToDatabase}
                    >
                      <Form.Item name="host" label="Connect URL" rules={[{ required: true }]}>
                        <Input placeholder="192.168.0.1" />
                      </Form.Item>
                      <Form.Item name="port" label="Connect Port" rules={[{ required: true }]}>
                        <InputNumber placeholder="5432" className="FullWidth" />
                      </Form.Item>
                      <Form.Item name="database" label="Database Name" rules={[{ required: true }]}>
                        <Input placeholder="postgres" />
                      </Form.Item>
                      <Form.Item name="user" label="User Name" rules={[{ required: true }]}>
                        <Input placeholder="postgres" />
                      </Form.Item>
                      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password placeholder="postgres" />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">Connect</Button>
                        <Button style={{ marginLeft: '10px' }} type="primary" htmlType="button" onClick={closeModal}>Close </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerConnectionModal;
