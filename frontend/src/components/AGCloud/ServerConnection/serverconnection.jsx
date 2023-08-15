/* eslint-disable */
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button components from React Bootstrap
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { useDispatch } from 'react-redux';
import Frame from '../../frame/Frame';
import {
  connectToDatabase as connectToDatabaseApi,
  changeGraph,
} from '../../../features/database/DatabaseSlice';
import { getConnectionStatus } from '../../../features/database/DatabaseSlice';
import { disconnectToDatabase } from '../../../features/database/DatabaseSlice';
import { useEffect } from 'react';
import { addAlert } from '../../../features/alert/AlertSlice';
import { trimFrame } from '../../../features/frame/FrameSlice';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import {
  /* getMetaChartData, */ getMetaData,
} from '../../../features/database/MetadataSlice';

const FormInitialValue = {
  database: '',
  graph: '',
  host: '',
  password: '',
  port: null,
  user: '',
};

const ServerConnectionModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [connectionState, setConnectionState] = useState(false);
  const dispatch = useDispatch();

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  // Check Database Connection Status
  useEffect(() => {
    dispatch(getConnectionStatus()).then((response) => {
      if (response.type === 'database/getConnectionStatus/fulfilled') {
        setConnectionState(true);
      } else if (response.type === 'database/getConnectionStatus/rejected') {
        setConnectionState(false);
      }
    });
  }, [dispatch]);

  const connectToDatabase = (data) => {
    const loadingToastId = toast.loading('Connecting to database...');

    dispatch(connectToDatabaseApi(data)).then((response) => {
      toast.dismiss(loadingToastId);
      console.log('response', response);

      if (response.type === 'database/connectToDatabase/fulfilled') {
        dispatch(addAlert('NoticeServerConnected'));
        dispatch(trimFrame('ServerConnect'));
        toast.success('Connected successfully!');
        setConnectionState(true);
        closeModal();
      } else if (response.type === 'database/connectToDatabase/rejected') {
        dispatch(addAlert('ErrorServerConnectFail', response.error.message));
        toast.error('Error Server Connect Fail', response.error.message);
      }
    });
  };

  const handleConnection = () => {
    if (connectionState) {
      // Calling disconnect API
      dispatch(disconnectToDatabase()).then((response) => {
        console.log('response', response);
        setConnectionState(false);
        toast.success('Disconnected successfully!');
      });
    } else {
      openModal();
    }
  };

  return (
    <div>
      {/* <Toaster /> */}
      <button
        id="serverConnectionBtn"
        type="button"
        className={
          connectionState ? 'btn btn-danger' : 'btn btn-primary button'
        }
        onClick={handleConnection}
      >
        {connectionState ? 'Disconnect Database' : 'Connect Database'}
      </button>
      <Modal
        show={modalVisible}
        onHide={closeModal}
        backdrop="static"
        keyboard={false}
        centered
        size="md"
        style={{ backgroundColor: 'rgba(212, 217, 230, 0.2)' }}
      >
        <Modal.Header closeButton
        style={{  margin: 'auto' }}>
          <Modal.Title>
            Connect to Database</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row style={{ display: 'flex', flexDirection: 'column'}}>
            <Col style={{ textAlign: 'center', color: 'orangered'}}>
              <p>Database access might require an authenticated connection.</p>
            </Col>
            <Col>
              <div style={{ maxWidth: '450px', margin: 'auto' }}>
                <Form
                  initialValues={FormInitialValue}
                  layout="vertical"
                  onFinish={connectToDatabase}
                >
                  <Form.Item
                    name="host"
                    label="Connect URL"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="192.168.0.1" />
                  </Form.Item>
                  <Form.Item
                    name="port"
                    label="Connect Port"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      placeholder="5432"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="database"
                    label="Database Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="postgres" />
                  </Form.Item>
                  <Form.Item
                    name="user"
                    label="User Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="postgres" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true }]}
                  >
                    <Input.Password placeholder="postgres" />
                  </Form.Item>
                  <Form.Item 
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button type="primary" htmlType="submit">
                      Connect
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ServerConnectionModal;
