import React from 'react';
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
    // SELECT create_vlabel('${currentGraph}', '${labelName}');

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
      console.error('Error uploading files:', error);
    }
  };

  const openCSVFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.multiple = true;
    input.addEventListener('change', handleCSVFiles);
    input.click();
  };

  return (
    <button
      className="frame-head-button btn btn-link"
      type="button"
      onClick={openCSVFileDialog}
      title="Load graph from CSV File"
    >
      Load CSV
    </button>
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
