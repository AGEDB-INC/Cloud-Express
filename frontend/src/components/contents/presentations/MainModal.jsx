/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { getMetaData } from '../../../features/database/MetadataSlice';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button } from 'react-bootstrap';
import './Modal.css';
import store from '../../../app/store';

function MainModal({ 
  setCommand,
  command,
  update,
  addFrame,
  addAlert,
  database,
  executeCypherQuery,
  addCommandHistory,
}) {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activePromises, setPromises] = useState({});
  const [selectedGraph, setSelectedGraph] = useState('');
  const [graphNames, setGraphNames] = useState([]);
  
  useEffect(() => {
    dispatch(getMetaData())
      .then((metadata) => {
        setGraphNames(Object.keys(metadata.payload));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [update]);

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
      // onSelectProject(selectedProject);
    }
    closeModal();
  };

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
        const updatedPromises = { ...activePromises }; 
        updatedPromises[refKey] = req; 
        setPromises(updatedPromises); 
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
            SELECT create_vlabel('${selectedGraph}', '${labelName}')
            WHERE _label_id('${selectedGraph}', '${labelName}') = 0;
            SELECT load_labels_from_file('${selectedGraph}', '${labelName}', '${filePath}');
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
              SELECT create_elabel('${selectedGraph}', '${labelName}')
              WHERE _label_id('${selectedGraph}', '${labelName}') = 0;
              SELECT load_edges_from_file('${selectedGraph}', '${labelName}', '${filePath}');
            `;
            return sendQueryToDatabase(edgeQuery);
          });
      });
      await Promise.all(uploadEdgeFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  const openCSVFileDialog = (value, event) => {
    handleProjectSelection(value, event);
    if(selectedGraph !== '') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.multiple = true;
      input.addEventListener('change', handleCSVFiles);
      input.click();
    }
  };
  
  const handleGraphChange = (event) => {
    setSelectedGraph(event.target.value);
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <select
              value={selectedGraph}
              onChange={handleGraphChange}
              style={{
                marginBottom: '20px',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '300px',
                fontSize: '16px',
              }}
            >
              <option value="">Select a graph</option>
              {graphNames.map((graphName) => (
                <option key={graphName} value={graphName}>
                  {graphName}
                </option>
              ))}
            </select>
            <p style={{ fontStyle: 'italic', color: '#666' }}>Selected graph: {selectedGraph}</p>
          </div>

          <p>
            {' '}
            <strong>Built-in database projects</strong>
          </p>

          <div style={{ display: 'flex', justifyContent: 'left'}}>

            <label>
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

          </div>
          <p className="mt-3">
            {' '}
            <strong>Import your own data for a new database project</strong>
          </p>
          <div style={{ display: 'flex', justifyContent: 'left'}} >
            <label >
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
                  onChange={(event) => openCSVFileDialog(event.target.value, event)}
                  />
              </div>
            </label>
          </div>

          {selectedGraph === '' && selectedProject !== '' && (
            <p style={{ color: 'red', marginTop: '10px' }}>Please select a graph before choosing a project.</p>
          )}

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
  // addCommandFavorites: PropTypes.func.isRequired,
};

export default MainModal;