import React, { useState } from 'react';
import './guidepage.css';

function GuidePages() {
  const pages = [
    {
      title: 'Tutorial - Graph for Movies Data',
      subheading: 'Explore more OpenCypher and AG Cloud functionality using a subset of the IMDB Movies database.',
      content: 'This tutorial guides you through the following steps using OpenCypher graph query language. \nYou can also watch a tutorial video at  https://www.youtube.com/watch?v=8S1IJswl7Lg .\n\n  Create Graph: Show how to create and edit a graph database.\n MATCH Command: Search data using pattern matching.\n Traverse through Data: Search through data (movies, actors) and their relationships (acting, directing...).\n Path Finding: Seeing how seemingly unrelated movies and people are related and finding shortest paths.',
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const maxpages = 5;

  const handleNextPage = () => {
    if (currentPage !== maxpages) {
      setCurrentPage((prevPage) => (prevPage < pages.length - 1 ? prevPage + 1 : prevPage));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage !== 0) {
      setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
    }
  };

  const { title, subheading, content } = pages[currentPage];

  return (
    <div className="page">
      <div className="content">
        <h2 className="title">{title}</h2>
        <hr />
        <p className="subheading">{subheading}</p>
        <p className="content">
          {content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
      <div className="navigation">
        {currentPage !== 0 && (
          <button type="button" className="previousButton" onClick={handlePreviousPage}>
            <b>&lt;</b>
            Previous
          </button>
        )}
        <h5>
          {currentPage + 1}
          of
          {maxpages}
        </h5>
        {currentPage !== maxpages && (
          <button type="button" className="nextButton" onClick={handleNextPage}>
            Next
            <b>&gt;</b>
          </button>
        )}
      </div>
    </div>
  );
}

export default GuidePages;
