import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Modal.css'; // Import your CSS file

const MainModal = ({ onSelectProject }) => {
  const [selectedProject, setSelectedProject] = useState('');

  function openModal() {
    document.getElementById('myModal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('myModal').style.display = 'none';
    document.getElementById('closeButton').style.background = 'transparent';
    document.getElementById('newProjectButton').style.background = 'transparent';
  }

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
      <button
        id="myBtn"
        type="button"
        onClick={openModal}
        style={{
          background: 'none', border: 'none', color: '#142b80', fontSize: 18,
        }}
      >
        + Add a New Project
      </button>
      <div id="myModal" className="modal">
        <div className="modal-content" style={{ height: '600px', width: '600px' }}>
          <div className="div-style" style={{ height: '120px' }}>
            <h2 className="first-heading" style={{ marginLeft: '40px' }}>
              New Project
            </h2>
            <p className="paragraph" style={{ color: 'blue' }}>
              Create a new AgensGraph database.
            </p>
          </div>

          <div className="projects-div-style">
            <h4 className="second-heading">Built-in database projects</h4>

            <div className="rectangle-display">
              <div className="rectangle-radio" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <label className="radio-text" htmlFor="moviesData">
                  Graph for Movies Data
                  <input
                    style={{ marginTop: '-20px' }}
                    id="moviesData"
                    className="radio-circle"
                    type="radio"
                    name="builtInProjects"
                    value="Graph For Movies Data"
                    onChange={handleProjectSelection}
                  />
                </label>
              </div>
              <div className="rectangle-radio" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <label className="radio-text" htmlFor="fraudDetection">
                  Graph for Fraud Detection
                  <input
                    id="fraudDetection"
                    className="radio-circle"
                    type="radio"
                    name="builtInProjects"
                    value="Graph for Fraud Detection"
                    onChange={handleProjectSelection}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="projects-div-style" style={{ marginTop: '-30px' }}>
            <h4 className="second-heading" style={{ width: '100%' }}>Import your own data</h4>

            <div className="rectangle-display">
              <div className="csv-radio" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <label className="radio-text" htmlFor="importCSV">
                  Import User Data (.CSV)
                  <input
                    id="importCSV"
                    className="radio-circle"
                    type="radio"
                    name="builtInProjects"
                    value="Import User Data (.CSV)"
                    onChange={handleProjectSelection}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="button-div-style" style={{ marginTop: '-20px' }}>
            <div className="button-display">
              <div
                className="rectangle-button-div"
                id="newProjectButton"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                role="button"
                tabIndex={0}
                onKeyDown={closeModal}
                onClick={handleCreateProject}
              >
                <span className="rectangle-button">+ Create New Project</span>
              </div>
              <div
                className="rectangle-button-div"
                id="closeButton"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                role="button"
                tabIndex={0}
                onKeyDown={closeModal}
                onClick={closeModal}
              >
                <span className="rectangle-button">Cancel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MainModal.propTypes = {
  onSelectProject: PropTypes.func.isRequired,
};

export default MainModal;
