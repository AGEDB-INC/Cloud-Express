/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MainModalContainer from "../../contents/containers/MainModal";
import "./MyProjectTab.css";
import { getMetaData } from "../../../features/database/MetadataSlice";
import TutorialGuideTab from "../tutorialguidetab/tutorialguidetab";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../services/api";

const MyProjectTab = () => {
  const dispatch = useDispatch();
  const [graphNames, setGraphNames] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(getMetaData())
      .then((metadata) => {
        console.log("Metadata response:", metadata);
        console.log("Metadata payload:", metadata.payload);
        setGraphNames(Object.keys(metadata.payload));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleGoToAgeViewer = () => {
    // navigate("/");
    window.open("/");

  };
  const [projectData, setProjectData] = useState(null);

  const handleProjectData = (data) => {
    console.log("Received project data:", data);
    setProjectData(data);
  };

  const deleteProject = async () => {
    try {
      toast.loading("Deleting project...");
      const response = await api.delete("/project/delete", {
        withCredentials: true,
      });
      toast.dismiss();
      setProjectData(null);
      toast.success("Successfully deleted project!");
      const data = response.data;
      console.log(data);
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred:", error.message);
      console.log(error);
    }

  };

  return (
    <div>
      <div
        className="div-style"
        style={{ display: "flex", alignItems: "flex-start" }}
      >
        <h2 className="first-heading">My Project</h2>
        <p className="paragraph">
          Add a project to view its graph visualization in AGEViewer.
        </p>
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
            <td id="firstColumn" className="column-title">
              {projectData ? projectData.startDate : "-"}
            </td>
            <td id="secondColumn" className="column-title">
              {projectData ? projectData.projectName : "-"}
            </td>
            <td id="thirdColumn" className="column-title">
              {projectData ? projectData.daysLeft : "-"}
            </td>
            <td>
              <div>
                {projectData ? (
                  <div>
                    <button
                      id="ageViewerButton"
                      type="button"
                      className="btn btn-success"
                      onClick={handleGoToAgeViewer}
                    >
                      Go to ageviewer
                    </button>
                    <button
                      id="deleteButton"
                      type="button"
                      style={{ marginLeft: "20px" , color: "red", border: "1px solid red", backgroundColor: "transparent",}}
                      className="btn btn-danger"
                      onClick={deleteProject}
                    >
                      Delete
                    </button>
                  </div>
                ) : graphNames.length != 0 ? null : (
                  <div>Loading...</div>
                )}
              </div>
              {graphNames.length > 0 && !projectData && (
                <MainModalContainer allGraphs={graphNames} onProjectCreated={handleProjectData} />
              )}
            </td>
          </tr>
        </table>
      </div>
      <TutorialGuideTab selectedTab={projectData ? "tab1" : ""} />
    </div>
  );
};

export default MyProjectTab;
