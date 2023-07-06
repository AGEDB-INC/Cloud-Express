/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button } from 'react-bootstrap';
import './Modal.css';

const MainModal = ({ onSelectProject }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    if (selectedElement) {
      selectedElement.style.border = '1px solid #e3e6f0';
    }
    setSelectedElement(null); // Clear the selected element when modal closes
    setSelectedProject(''); // Clear the selected project when modal closes
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

  const handleProjectSelection = (value, event) => {
    setSelectedProject(value);
    if (selectedElement) {
      selectedElement.style.border = '1px solid #e3e6f0';
    }
    event.target.parentNode.style.border = '3px solid blue';
    setSelectedElement(event.target.parentNode);
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
                  border: selectedProject === 'Graph for Movie Data' ? '3px solid blue' : '1px solid #e3e6f0',
                  padding: '30px',
                  display: 'flex',
                  borderRadius: '5px',
                  gap: '5rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = '3px solid blue';
                }}
                onMouseLeave={(e) => {
                  if(selectedProject !== 'Graph for Movie Data') e.target.style.border = '1px solid #e3e6f0';
                }}
              >
                Graph for Movie Data
                <input
                    type="radio"
                    name="projectType"
                    value="Graph for Movie Data"
                    style={{ transform: 'scale(1.5)' }}
                    onChange={(event) => handleProjectSelection(event.target.value, event)}
                />
              </div>
            </label>
            <label>
              <div
                style={{
                  border: selectedProject === 'Graph for Fraud Detection' ? '3px solid blue' : '1px solid #e3e6f0',
                  padding: '30px',
                  display: 'flex',
                  borderRadius: '5px',
                  gap: '5rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = '3px solid blue';
                }}
                onMouseLeave={(e) => {
                  if(selectedProject !== 'Graph for Fraud Detection') e.target.style.border = '1px solid #e3e6f0';
                }}
              >
                Graph for Fraud Detection
                <input
                  type="radio"
                  name="projectType"
                  value="Graph for Fraud Detection"
                  style={{ transform: 'scale(1.5)' }}
                  onChange={(event) => handleProjectSelection(event.target.value, event)}
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
                  border: selectedProject === 'Import User Data (.CSV)' ? '3px solid blue' : '1px solid #e3e6f0',
                  padding: '28px',
                  display: 'flex',
                  borderRadius: '5px',
                  gap: '5rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = '3px solid blue';
                }}
                onMouseLeave={(e) => {
                  if(selectedProject !== 'Import User Data (.CSV)') e.target.style.border = '1px solid #e3e6f0';
                }}
              >
                Import User Data (.CSV)
                <input
                  type="radio"
                  name="projectType"
                  style={{ transform: 'scale(1.5)' }}
                  value='Import User Data (.CSV)'
                  onChange={(event) => handleProjectSelection(event.target.value, event)}
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
            disabled={selectedProject === ''}
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
