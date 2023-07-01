import React from 'react';
import './MyProjectTab.css';
import MainModal from '../Modal/Modal';

const MyProjectTab = () => {
  const [rowCount, setRowCount] = React.useState(0);

  React.useEffect(() => {
    const table = document.getElementById('projectDetailsTable');
    const count = table.ariaRowCount;
    setRowCount(count);
  });

  return (
    <div>
      <div className="div-style">
        <h2 className="first-heading">
          My Project
        </h2>
        <p className="paragraph">
          Add a project to view its graph visualization in AGEViewer.
        </p>
      </div>
      <h2 className="mid-heading">
        AgensGraph Database Project
      </h2>
      <div className="project-table">
        <table id="projectDetailsTable" className="project-details">
          <tr>
            <th className="column-title">Date created</th>
            <th className="column-title">Project name</th>
            <th className="column-title">Days left for use</th>
          </tr>
          <tr className="second-row">
            <th className="column-title"> - </th>
            <th className="column-title"> - </th>
            <th className="column-title"> - </th>
            <th>
              <div>
                {rowCount > 1 ? (<button id="ageViewerButton" type="button" className="move-button"> Go to ageviewer </button>) : (<MainModal />)}
              </div>
            </th>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default MyProjectTab;
