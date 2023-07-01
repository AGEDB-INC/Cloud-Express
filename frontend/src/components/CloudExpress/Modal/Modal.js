import React from 'react';
import './Modal.css'; // Import your CSS file

const MainModal = () => {
  function openModal() {
    document.getElementById('myModal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }

  const handleHover = (event) => {
    event.target.style.borderColor = 'blue'; // Set the background color on hover
  };

  const handleLeave = (event) => {
    event.target.style.borderColor = 'lightgray'; // Reset the background color on leave
  };

  const handleButtonHover = (event) => {
    event.target.style.backgroundColor = '#B2BEB5'; // Set the background color on hover
  };

  const handleButtonLeave = (event) => {
    event.target.style.backgroundColor = 'lightgray'; // Reset the background color on leave
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
          <div className="div-style">
            <h2 className="first-heading">
              New Project
            </h2>
            <p className="paragraph">
              Create a new AgensGraph database.
            </p>
          </div>

          <div className="projects-div-style">
            <h4 className="second-heading">Built-in database projects</h4>

            <div className="rectangle-display">
              <div className="rectangle-radio" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <label className="radio-text">
                  Graph for Movies Data
                </label>
                <input className="radio-circle" type="radio" name="builtInProjects" value="moviesData" />
              </div>
              <div className="rectangle-radio" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <label className="radio-text">
                  Graph for Fraud Detection
                </label>
                <input className="radio-circle" type="radio" name="builtInProjects" value="fraudDetection" />
              </div>
            </div>
          </div>

          <div className="projects-div-style" style={{ marginTop: '80px' }}>
            <h4 className="second-heading" style={{ width: '100%' }}>Import your own data</h4>

            <div className="rectangle-display">
              <div className="csv-radio" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <label className="radio-text">
                  User Data (.CSV)
                </label>
                <input className="radio-circle" type="radio" name="builtInProjects" value="option1" />
              </div>
            </div>
          </div>

          <div className="button-div-style">
            <div className="button-display">
              <div className="rectangle-button-div" onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
                <span className="rectangle-button" id="newProjectButton">+ Create New Project</span>
              </div>
              <div className="rectangle-button-div" id="closeButton" onKeyDown={closeModal} onClick={closeModal} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
                <span className="rectangle-button">Cancel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainModal;
