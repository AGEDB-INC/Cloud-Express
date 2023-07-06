import React, { useState } from 'react';
import './guidepage.css';

function GuidePages() {
  const pages = [
    {
      title: 'Tutorial - Graph for Movies Data',
      subheading: 'Explore more OpenCypher and AG Cloud functionality using a subset of the IMDB Movies database.',
      content: 'This tutorial guides you through the following steps using OpenCypher graph query language. \nYou can also watch a tutorial video at  https://www.youtube.com/watch?v=8S1IJswl7Lg .\n\n  Create Graph: Show how to create and edit a graph database.\n MATCH Command: Search data using pattern matching.\n Traverse through Data: Search through data (movies, actors) and their relationships (acting, directing...).\n Path Finding: Seeing how seemingly unrelated movies and people are related and finding shortest paths.',
    },
    {
      title: 'Build Graph',
      subheading: ' ',
      content: 'CREATE clause to construct the vertices and relationships in the graph.\n\nThe code below has already been run, for your convenience, and so the graph is already built.\nYou can study the code with the notes below and the comments in the code, or see the graph immediately.\nTo see the graph launch AGViewer and enter the following in the Query Editor. Then hit play to the right of the Query Editor window.',
    },
    {
      title: 'Find Data',
      subheading: ' ',
      content: 'Simple MATCH queries can find data in the graph.\n\nPlay each of the following queries at your AGViewer instance (after copying it into the Query Editor at AGViewer).\nFind out if Tom Hanks is in your Movie Graph?',
    },
    {
      title: 'Traverse Through Graph',
      subheading: ' ',
      content: 'Up to now we\'ve returned only nodes. To see edges too we need to return paths (i.e. edges and nodes). This shows us relationships between the nodes.\nWhich movies was Tom Hanks involved with?',
    },
    {
      title: 'Variable Length Paths',
      subheading: ' ',
      content: 'Stanley Milgram\'s "The Small World Experiment" suggested that human society is a small-world-type network characterized by short path-lengths. \nThe “Six degrees of separation” idea is that all people on average are six, or fewer, social connections away from each other.\n\nRun the following queries in your AGViewer instance. \n\nWho are within 3 hops from Kevin Bacon.',
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
          {content.split('\n').map((line) => (
            <>
              {line}
              <br />
            </>
          ))}
        </p>
      </div>
      <div className="navigation">
        {currentPage !== -1 && (
          <button type="button" className="previousButton" onClick={handlePreviousPage}>
            <b>&lt;</b>
            {' '}
            Previous
          </button>
        )}
        <h5>
          {currentPage + 1}
          of
          {' '}
          {maxpages}
        </h5>
        {currentPage !== maxpages && (
          <button type="button" className="nextButton" onClick={handleNextPage}>
            Next
            {' '}
            <b>&gt;</b>
          </button>
        )}
      </div>
    </div>
  );
}

export default GuidePages;
