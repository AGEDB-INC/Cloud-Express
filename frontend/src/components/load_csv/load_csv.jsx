import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import { connect } from 'react-redux';
import store from '../../app/store';
import { getMetaData } from '../../features/database/MetadataSlice';

const mapStateToProps = (state) => ({
  currentGraph: state.metadata.currentGraph,
});

function OpenCSVFileDialog({
  currentGraph,
  activePromises,
  setPromises,
  dispatch,
  setCommand,
  command,
  update,
  addFrame,
  addAlert,
  database,
  executeCypherQuery,
  addCommandHistory,
}) {
  async function sendQueryToDatabase(query) {
    const refKey = uuid();
    if (database.status !== 'connected') {
      return Promise.reject(new Error('Database is not connected.'));
    }
    setCommand(query);
    const currentCommand = store.getState().editor.command;
    addFrame(currentCommand, 'CypherResultFrame', refKey);
    const req = dispatch(() => executeCypherQuery([refKey, currentCommand]));
    // Return the Promise chain
    return req.then((response) => {
      if (response.type === 'cypher/executeCypherQuery/rejected') {
        if (response.error.name !== 'AbortError') {
          dispatch(() => addAlert('ErrorCypherQuery'));
          const latestCommand = store.getState().editor.command;
          if (latestCommand === '') {
            setCommand(command);
          }
        }
        return;
      }
      if (update) dispatch(getMetaData());
    })
      .finally(() => {
        const updatedPromises = { ...activePromises }; // Create a copy of activePromises
        updatedPromises[refKey] = req; // Modify the copy
        setPromises(updatedPromises); // Update the activePromises state with the modified copy
        dispatch(() => addCommandHistory(command));
        setCommand('');
      });
  }

  const handleCSVFiles = async (event) => {
    const { files } = event.target;
    const nodeFiles = [];
    const edgeFiles = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (file.name.includes('[') && file.name.includes('&') && file.name.includes(']')) {
        const labelName = file.name.substring(0, file.name.indexOf('['));
        edgeFiles.push({ file, labelName });
      } else {
        nodeFiles.push(file);
      }
    }

    const uploadNodeFiles = nodeFiles.map((file) => {
      const labelName = file.name.replace('.csv', '');
      const formData = new FormData();
      formData.append('file', file);
      return fetch('/api/v1/db/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Error uploading node file: ${response.status}`);
        })
        .then(({ filePath }) => {
          const nodeQuery = `
            SELECT create_vlabel('${currentGraph}', '${labelName}')
            WHERE _label_id('${currentGraph}', '${labelName}') = 0;
            SELECT load_labels_from_file('${currentGraph}', '${labelName}', '${filePath}');
          `;
          return sendQueryToDatabase(nodeQuery);
        });
    });

    try {
      await Promise.all(uploadNodeFiles);
      const uploadEdgeFiles = edgeFiles.map(({ file, labelName }) => {
        const formData = new FormData();
        formData.append('file', file);
        return fetch('/api/v1/db/upload', {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Error uploading node file: ${response.status}`);
          })
          .then(({ filePath }) => {
            const edgeQuery = `
              SELECT create_elabel('${currentGraph}', '${labelName}')
              WHERE _label_id('${currentGraph}', '${labelName}') = 0;
              SELECT load_edges_from_file('${currentGraph}', '${labelName}', '${filePath}');
            `;
            return sendQueryToDatabase(edgeQuery);
          });
      });
      await Promise.all(uploadEdgeFiles);
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error uploading files:', error);
    }
  };
  const [dropdownValue, setDropdownValue] = useState('');
  const openCSVFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.multiple = true;
    input.addEventListener('change', handleCSVFiles);
    input.click();
  };
  // Placeholder function for option2
  const handleSampleCSV = () => {
    fetch('/api/v1/db/Samplefiles')
      .then((response) => response.json())
      .then(async (fileInfos) => {
        const nodeQueries = fileInfos
          .filter((file) => file.type === 'node')
          .map((file) => {
            const labelName = file.name.split('.')[0]; // Assuming label name is the filename without extension
            const query = `
              SELECT create_vlabel('${currentGraph}', '${labelName}')
              WHERE _label_id('${currentGraph}', '${labelName}') = 0;
              SELECT load_labels_from_file('${currentGraph}', '${labelName}', '${file.path}');
            `;
            return sendQueryToDatabase(query); // Replace with your SQL execution function
          });
        await Promise.all(nodeQueries);
        const edgeQueries = fileInfos
          .filter((file) => file.type === 'edge')
          .map((file) => {
            // eslint-disable-next-line
            const labelName = file.name.substring(0, file.name.indexOf('['));
            const query = `
              SELECT create_elabel('${currentGraph}', '${labelName}')
              WHERE _label_id('${currentGraph}', '${labelName}') = 0;
              SELECT load_edges_from_file('${currentGraph}', '${labelName}', '${file.path}');
            `;
            return sendQueryToDatabase(query);
          });
        return Promise.all(edgeQueries);
      })
      .then(() => {
        // eslint-disable-next-line
        console.log('All queries executed');
      })
      // eslint-disable-next-line
      .catch((error) => console.error('Error:', error));
  };
  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
    switch (event.target.value) {
      case 'load_from_system':
        openCSVFileDialog();
        setDropdownValue('');
        break;
      case 'load_sample_csvs':
        handleSampleCSV();
        setDropdownValue('');
        break;
      default:
        break;
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center p-0 m-0">
      <select
        value={dropdownValue}
        onChange={handleDropdownChange}
        className="frame-head-button btn btn-link"
      >
        <option value="">Load CSV...</option>
        <option value="load_from_system">Load Local CSVs</option>
        <option value="load_sample_csvs">Load Sample CSVs</option>
      </select>
    </div>
  );
}

OpenCSVFileDialog.propTypes = {
  currentGraph: PropTypes.string.isRequired,
  activePromises: PropTypes.shape({}).isRequired,
  setPromises: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  setCommand: PropTypes.func.isRequired,
  command: PropTypes.string.isRequired,
  addFrame: PropTypes.func.isRequired,
  addAlert: PropTypes.func.isRequired,
  database: PropTypes.shape({
    status: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
  }).isRequired,
  executeCypherQuery: PropTypes.func.isRequired,
  addCommandHistory: PropTypes.func.isRequired,
  update: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(OpenCSVFileDialog);
