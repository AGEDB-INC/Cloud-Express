/* eslint-disable no-unused-vars */
import React, { useState } from 'react'; // Import your CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button components from React Bootstrap
import {
  Col, Form, Input, InputNumber, Row,
} from 'antd';
import { useDispatch } from 'react-redux';
import Frame from '../../frame/Frame';
import { connectToDatabase as connectToDatabaseApi, changeGraph } from '../../../features/database/DatabaseSlice';
import { addAlert } from '../../../features/alert/AlertSlice';
import { addFrame, trimFrame } from '../../../features/frame/FrameSlice';
import { /* getMetaChartData, */ getMetaData } from '../../../features/database/MetadataSlice';

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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const dispatch = useDispatch();

  const connectToDatabase = (data) => dispatch(connectToDatabaseApi(data)).then((response) => {
    if (response.type === 'database/connectToDatabase/fulfilled') {
      dispatch(addAlert('NoticeServerConnected'));
      dispatch(trimFrame('ServerConnect'));
      alert('Server Connected');
      // dispatch(getMetaData({ currentGraph })).then((metadataResponse) => {
      //   if (metadataResponse.type === 'database/getMetaData/fulfilled') {
      //     const graphName = Object.keys(metadataResponse.payload)[0];
      //     /* dispatch(getMetaChartData()); */
      //     dispatch(changeGraph({ graphName }));
      //   }
      //   if (metadataResponse.type === 'database/getMetaData/rejected') {
      //     dispatch(addAlert('ErrorMetaFail'));
      //   }
      // });

      dispatch(addFrame(':server status', 'ServerStatus'));
    } else if (response.type === 'database/connectToDatabase/rejected') {
      dispatch(addAlert('ErrorServerConnectFail', response.error.message));
      alert('Error Server Connect Fail', response.error.message);
    }
  });

  return (
    <div>
      <button
        id="serverConnectionBtn"
        type="button"
        className="btn btn-lg btn-success"
        onClick={openModal}
      >
        Connect Database
      </button>
      <Modal
        show={modalVisible}
        onHide={closeModal}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Connect to Database</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col span={6}>
              <h3>Connect to Database</h3>
              <p>Database access might require an authenticated connection.</p>
            </Col>
            <Col span={18}>
              <div style={{ maxWidth: '450px' }}>
                <Form
                  initialValues={FormInitialValue}
                  layout="vertical"
                  onFinish={connectToDatabase}
                >
                  <Form.Item name="host" label="Connect URL" rules={[{ required: true }]}>
                    <Input placeholder="192.168.0.1" />
                  </Form.Item>
                  <Form.Item name="port" label="Connect Port" rules={[{ required: true }]}>
                    <InputNumber placeholder="5432" style={{ width: '100% !important' }} />
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
