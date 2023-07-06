/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button } from 'react-bootstrap';
import './Modal.css';

const MainModal = ({ onSelectProject }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [selectedProject, setSelectedProject] = useState('');

  const handleHover = (event) => {
    const updatedEvent = { ...event };
    updatedEvent.target.style.borderColor = 'blue'; // Set the background color on hover
  };

  const handleLeave = (event) => {
    const updatedEvent = { ...event };
    updatedEvent.target.style.borderColor = 'lightgray';
  };

  const handleButtonHover = (event) => {
    const updatedEvent = { ...event };
    updatedEvent.target.style.backgroundColor = '#B2BEB5'; // Set the background color on hover
  };

  const handleButtonLeave = (event) => {
    const updatedEvent = { ...event };
    updatedEvent.target.style.backgroundColor = 'white'; // Reset the background color on leave
  };

  const handleProjectSelection = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleCreateProject = () => {
    if (selectedProject) {
      onSelectProject(selectedProject);
    }
    closeModal();
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={openModal} type="button">
        + Add a New Project
      </button>

      <Modal
        show={modalVisible}
        onHide={closeModal}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {' '}
            <strong>Built-in database projects</strong>
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <label style={{ marginRight: '20px' }}>
              <div
                style={{
                  border: '1px solid #e3e6f0',
                  padding: '30px',
                  display: 'flex',
                  borderRadius: '5px',
                  gap: '5rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = '3px solid blue';
                }}
                onMouseLeave={(e) => {
                  e.target.style.border = '1px solid #e3e6f0';
                }}
              >
                Graph for Movie Data
                <input
                  type="radio"
                  name="projectType"
                  style={{ transform: 'scale(1.5)' }}
                  onChange={handleProjectSelection}
                />
              </div>
            </label>
            <label>
              <div
                style={{
                  border: '1px solid #e3e6f0',
                  padding: '30px',
                  display: 'flex',
                  borderRadius: '5px',
                  gap: '5rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = '3px solid blue';
                }}
                onMouseLeave={(e) => {
                  e.target.style.border = '1px solid #e3e6f0';
                }}
              >
                Graph for Fraud Detection
                <input
                  type="radio"
                  name="projectType"
                  style={{ transform: 'scale(1.5)' }}
                  onChange={handleProjectSelection}
                />
              </div>
            </label>
          </div>
          <p className="mt-3">
            {' '}
            <strong>Import your own data for a new database project</strong>
          </p>
          <div className="container ml-3">
            <label>
              <div
                style={{
                  border: '1px solid #e3e6f0',
                  padding: '28px',
                  display: 'flex',
                  borderRadius: '5px',
                  gap: '5rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = '3px solid blue';
                }}
                onMouseLeave={(e) => {
                  e.target.style.border = '1px solid #e3e6f0';
                }}
              >
                Import User Data (.CSV)
                <input
                  type="radio"
                  name="projectType"
                  style={{ transform: 'scale(1.5)' }}
                  onChange={handleProjectSelection}
                />
              </div>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="lg"
            onClick={closeModal}
            style={{
              width: '30%',
            }}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            variant="primary"
            style={{
              width: '30%',
            }}
            onClick={handleCreateProject}
          >
            + Create New Project
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

MainModal.propTypes = {
  onSelectProject: PropTypes.func.isRequired,
};

export default MainModal;
