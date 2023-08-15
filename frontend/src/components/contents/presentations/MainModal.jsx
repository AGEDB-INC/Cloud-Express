/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import { getMetaData } from "../../../features/database/MetadataSlice";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Modal, Button } from "react-bootstrap";
import "./Modal.css";
import store from "../../../app/store";
import api from "../../../services/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainModal({
  allGraphs,
  onProjectCreated,
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
  const [selectedGraph, setSelectedGraph] = useState("");
  const [graphNames, setGraphNames] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCSVFiles, setselectedCSVFiles] = useState([]);

  useEffect(() => {
    setGraphNames(allGraphs);
  }, []);

  // Get Project Data From Database when modal is closed
  useEffect(() => {
    if (!modalVisible) {
      getProjectData();
    }
  }, [modalVisible]);

  // Function to Get User Project Data From Database
  const getProjectData = async () => {
    try {
      const response = await api.get("/project/id", {
        withCredentials: true,
      });
      const res = await response.data;

      const start = dayjs(res.startDate);
      const end = dayjs(res.endDate);
      const today = dayjs(Date.now());
      var days = 0;
      if (!today.isAfter(end)) {
        days = end.diff(today, "days") + 1;
      }

      const data = {
        projectName: res.projectName,
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
        daysLeft: days,
      };
      onProjectCreated(data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    if (selectedElement) {
      selectedElement.style.border = "1px solid #e3e6f0";
    }
    setSelectedElement(null);
    setSelectedProject("");
    setModalVisible(false);
  };

  // Function to Create New User Project in Database
  const handleCreateProject = async () => {
    if (selectedProject) {
      let csvFilesPromise;

    if (selectedProject === "Import User Data (.CSV)") {
      csvFilesPromise = handleCSVFiles();
      csvFilesPromise.then(async () => {
        // After handleCSVFiles() completes, make a request to cleanUpUploadedFiles
        try {
          const cleanUpResponse = await fetch("/api/v1/db/cleanUpUploadedFiles", {
            method: "POST", // You can adjust the method as needed
          });

          if (cleanUpResponse.ok) {
            console.log("CSV Files Imported and Uploaded Files Cleaned Up");
          } else {
            console.error("Error cleaning up uploaded files:", cleanUpResponse.statusText);
          }
        } catch (error) {
          console.error("Error cleaning up uploaded files:", error);
        }
      });
    }
      else {
        handleSampleCSV(selectedProject);
      }
      toast.loading("Creating project...");
      const projectName = selectedProject;
      try {
        const response = await api.post(
          "/project/create",
          { projectName },
          {
            withCredentials: true,
          }
        );

        const data = response.data;
        toast.dismiss();
        toast.success("Successfully created project!");
      } catch (error) {
        toast.dismiss();
        console.log(error);
        toast.error("An error occurred:", error.message);
      }
    }
    closeModal();
  };

  const handleHover = (event) => {
    const updatedEvent = { ...event };
    updatedEvent.target.style.borderColor = "blue"; // Set the background color on hover
  };

  const handleLeave = (event) => {
    const updatedEvent = { ...event };
    updatedEvent.target.style.borderColor = "lightgray";
  };

  const handleButtonHover = (event) => {
    const updatedEvent = { ...event };
    updatedEvent.target.style.backgroundColor = "#B2BEB5"; // Set the background color on hover
  };

  const handleButtonLeave = (event) => {
    const updatedEvent = { ...event };
    updatedEvent.target.style.backgroundColor = "white"; // Reset the background color on leave
  };

  const handleProjectSelection = (value, event) => {
    setSelectedProject(value);
    if (selectedElement) {
      selectedElement.style.border = "1px solid #e3e6f0";
    }
    event.target.parentNode.style.border = "3px solid blue";
    setSelectedElement(event.target.parentNode);
  };

  async function sendQueryToDatabase(query) {
    const refKey = uuid();
    if (database.status !== "connected") {
      return Promise.reject(new Error("Database is not connected."));
    }
    setCommand(query);
    const currentCommand = store.getState().editor.command;
    addFrame(currentCommand, "CypherResultFrame", refKey);
    const req = dispatch(() => executeCypherQuery([refKey, currentCommand]));
    // Return the Promise chain
    return req
      .then((response) => {
        if (response.type === "cypher/executeCypherQuery/rejected") {
          if (response.error.name !== "AbortError") {
            dispatch(() => addAlert("ErrorCypherQuery"));
            const latestCommand = store.getState().editor.command;
            if (latestCommand === "") {
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
        setCommand("");
      });
  }

  const handleCSVFiles = async () => {
    const nodeFiles = [];
    const edgeFiles = [];

    for (let i = 0; i < selectedCSVFiles.length; i += 1) {
      const file = selectedCSVFiles[i];
      if (
        file.name.includes("eg_") 
      ) {
        const labelName = file.name.replace(".csv", "");
        edgeFiles.push({ file, labelName });
      } else {
        nodeFiles.push(file);
      }
    }

    const uploadNodeFiles = nodeFiles.map((file) => {
      const labelName = file.name.replace(".csv", "");
      const formData = new FormData();
      formData.append("file", file);
      return fetch("/api/v1/db/upload", {
        method: "POST",
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
        formData.append("file", file);
        return fetch("/api/v1/db/upload", {
          method: "POST",
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
      console.error("Error uploading files:", error);
    }
  };
  const handleFileSelection = (event) => {
    setselectedCSVFiles([...event.target.files]); // Store the selected files in the state
  };
  const openCSVFileDialog = (value, event) => {
    handleProjectSelection(event.target.value, event)
    if (selectedGraph !== "") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.multiple = true;
      input.addEventListener("change", handleFileSelection);
      input.click();
    }
  };
  const handleSampleCSV = (sampleFileName) => {
    fetch("/api/v1/db/Samplefiles")
      .then((response) => response.json())
      .then(async (data) => {
        const fileInfos = data[sampleFileName];
        const nodeQueries = fileInfos
          .filter((file) => file.type === "node")
          .map((file) => {
            const labelName = file.name.split(".")[0]; 
            const query = `
              SELECT create_vlabel('${selectedGraph}', '${labelName}')
              WHERE _label_id('${selectedGraph}', '${labelName}') = 0;
              SELECT load_labels_from_file('${selectedGraph}', '${labelName}', '${file.path}');
            `;
            return sendQueryToDatabase(query);
          });
        await Promise.all(nodeQueries);
        const edgeQueries = fileInfos
          .filter((file) => file.type === "edge")
          .map((file) => {
            const labelName = file.name.split(".")[0];
            const query = `
              SELECT create_elabel('${selectedGraph}', '${labelName}')
              WHERE _label_id('${selectedGraph}', '${labelName}') = 0;
              SELECT load_edges_from_file('${selectedGraph}', '${labelName}', '${file.path}');
            `;
            return sendQueryToDatabase(query);
          });
        return Promise.all(edgeQueries);
      })
      .then(() => {
      })
      .catch((error) => console.error("Error:", error));
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <select
              value={selectedGraph}
              onChange={handleGraphChange}
              style={{
                marginBottom: "20px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "300px",
                fontSize: "16px",
              }}
            >
              {graphNames != undefined && (
                graphNames.map((graphName) => (
                  <option key={graphName} value={graphName}>
                    {graphName}
                  </option>
                ))
              )}
            </select>
            <p style={{ fontStyle: "italic", color: "#666" }}>
              Selected graph: {selectedGraph}
            </p>
          </div>

          <p>
            {" "}
            <strong>Built-in database projects</strong>
          </p>

          {/* <div style={{ display: "flex", justifyContent: "left" }}>
            <label>
              <div
                style={{
                  border:
                    selectedProject === "Graph for Car Specification"
                      ? "3px solid blue"
                      : "1px solid #e3e6f0",
                  padding: "30px",
                  display: "flex",
                  borderRadius: "5px",
                  gap: "5rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = "3px solid blue";
                }}
                onMouseLeave={(e) => {
                  if (selectedProject !== "Graph for Car Specification")
                    e.target.style.border = "1px solid #e3e6f0";
                }}
              >
                Graph for Car Specification
                <input
                  type="radio"
                  name="projectType"
                  value="Graph for Car Specification"
                  style={{ transform: "scale(1.5)" }}
                  onChange={(event) =>
                    handleProjectSelection(event.target.value, event)
                  }
                />
                <input
                  type="radio"
                  name="projectType"
                  value="Graph for Car Specification"
                  style={{ transform: "scale(1.5)" }}
                  onChange={(event) =>
                    handleProjectSelection(event.target.value, event)
                  }
                />
                
              </div>
            </label>
          </div> */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "left" }}>
            <label>
              <div
                style={{
                  border:
                    selectedProject === "Graph for Car Specification"
                      ? "3px solid blue"
                      : "1px solid #e3e6f0",
                  padding: "30px",
                  display: "flex",
                  borderRadius: "5px",
                  gap: "5rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = "3px solid blue";
                }}
                onMouseLeave={(e) => {
                  if (selectedProject !== "Graph for Car Specification")
                    e.target.style.border = "1px solid #e3e6f0";
                }}
              >
                Graph for Car Specification
                <input
                  type="radio"
                  name="projectType"
                  value="Graph for Car Specification"
                  style={{ transform: "scale(1.5)" }}
                  onChange={(event) =>
                    handleProjectSelection(event.target.value, event)
                  }
                />
              </div>
            </label>
            <label>
              <div
                style={{
                  border:
                    selectedProject === "Graph for P2P Evaluation"
                      ? "3px solid blue"
                      : "1px solid #e3e6f0",
                  padding: "30px",
                  
                  display: "flex",
                  borderRadius: "5px",
                  gap: "5rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = "3px solid blue";
                }}
                onMouseLeave={(e) => {
                  if (selectedProject !== "Graph for P2P Evaluation")
                    e.target.style.border = "1px solid #e3e6f0";
                }}
              >
                Graph for P2P Evaluation
                <input
                  type="radio"
                  name="projectType"
                  value="Graph for P2P Evaluation"
                  style={{ transform: "scale(1.5)" }}
                  onChange={(event) =>
                    handleProjectSelection(event.target.value, event)
                  }
                />
              </div>
            </label>
            <label>
              <div
                style={{
                  border:
                    selectedProject === "Graph for Cyber Security"
                      ? "3px solid blue"
                      : "1px solid #e3e6f0",
                  padding: "30px",
                  display: "flex",
                  borderRadius: "5px",
                  gap: "5rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = "3px solid blue";
                }}
                onMouseLeave={(e) => {
                  if (selectedProject !== "Graph for Cyber Security")
                    e.target.style.border = "1px solid #e3e6f0";
                }}
              >
                Graph for Cyber Security
                <input
                  type="radio"
                  name="projectType"
                  value="Graph for Cyber Security"
                  style={{ transform: "scale(1.5)" }}
                  onChange={(event) =>
                    handleProjectSelection(event.target.value, event)
                  }
                />
              </div>
            </label>
          </div>
          <p className="mt-3">
            {" "}
            <strong>Import your own data for a new database project</strong>
          </p>
          <div style={{ display: "flex", justifyContent: "left" }}>
            <label>
              <div
                style={{
                  border:
                    selectedProject === "Import User Data (.CSV)"
                      ? "3px solid blue"
                      : "1px solid #e3e6f0",
                  padding: "28px",
                  display: "flex",
                  borderRadius: "5px",
                  gap: "5rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = "3px solid blue";
                }}
                onMouseLeave={(e) => {
                  if (selectedProject !== "Import User Data (.CSV)")
                    e.target.style.border = "1px solid #e3e6f0";
                }}
              >
                Import User Data (.CSV)
                <input
                  type="radio"
                  name="projectType"
                  style={{ transform: "scale(1.5)" }}
                  value="Import User Data (.CSV)"
                  onChange={(event) =>
                    openCSVFileDialog(event.target.value, event)
                  }
                />
              </div>
            </label>
          </div>

          {selectedGraph === "" && selectedProject !== "" && (
            <p style={{ color: "red", marginTop: "10px" }}>
              Please select a graph before choosing a project.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="lg"
            onClick={closeModal}
            style={{
              width: "30%",
            }}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            variant="primary"
            style={{
              width: "30%",
            }}
            onClick={handleCreateProject}
            // temporary if conditions will remove once other datasets are ready to put in.
            disabled={selectedProject === "" || selectedGraph === ""}
          >
            + Create New Project
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

MainModal.propTypes = {
  onProjectCreated: PropTypes.func,
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
