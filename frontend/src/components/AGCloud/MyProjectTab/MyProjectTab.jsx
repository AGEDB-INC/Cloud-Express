import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainModalContainer from '../../contents/containers/MainModal';
import './MyProjectTab.css';
import TutorialGuideTab from '../tutorialguidetab/tutorialguidetab';

const MyProjectTab = () => {
  const navigate = useNavigate();
  const handleGoToAgeViewer = () => {
    navigate('/');
  };

  const [rowCount, setRowCount] = useState(0);
  const [selectedRadioButton, setSelectedRadioButton] = useState('');
  const [selectedTab, setSelectedTab] = useState('');

  useEffect(() => {
    const table = document.getElementById('projectDetailsTable');
    const count = table.ariaRowCount;
    setRowCount(count);
  }, []);

  useEffect(() => {
    if (selectedRadioButton !== '') {
      document.getElementById('firstColumn').innerText = '2023-07-02';
      document.getElementById('secondColumn').innerText = selectedRadioButton;
      document.getElementById('thirdColumn').innerText = '30';
      setRowCount(2);
      setSelectedTab('tab1'); // Set the selectedTab based on the selectedRadioButton value
    } else {
      setRowCount(1);
    }
  }, [selectedRadioButton]);

  const handleRadioButtonChange = (value) => {
    setSelectedRadioButton(value);
  };

  return (
    <div>
      <div className="div-style" style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h2 className="first-heading">My Project</h2>
        <p className="paragraph">Add a project to view its graph visualization in AGEViewer.</p>
      </div>
      <h2 className="mid-heading">AGCloud Database Project</h2>
      <div className="project-table">
        <table id="projectDetailsTable" className="project-details">
          <tr>
            <th className="column-title">Date created</th>
            <th className="column-title">Project name</th>
            <th className="column-title">Days left for use</th>
          </tr>
          <tr className="second-row">
            <th id="firstColumn" className="column-title">-</th>
            <th id="secondColumn" className="column-title">-</th>
            <th id="thirdColumn" className="column-title">-</th>
            <th>
              <div>
                {rowCount > 1 ? (
                  <button id="ageViewerButton" type="button" className="btn btn-success" onClick={handleGoToAgeViewer}>
                    Go to ageviewer
                  </button>
                ) : (
                  <MainModalContainer onSelectProject={handleRadioButtonChange} />
                )}
              </div>
            </th>
          </tr>
        </table>
      </div>
      <TutorialGuideTab selectedTab={selectedTab} />
    </div>
  );
};

export default MyProjectTab;
