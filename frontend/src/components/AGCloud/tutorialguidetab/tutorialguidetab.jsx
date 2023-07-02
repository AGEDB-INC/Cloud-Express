import React from 'react';
import './tutorialguidetab.css';
import MainModal from '../Modal/Modal';
import GuidePages from '../GuidePage/guidepage';

const TutorialGuideTab = () => {
  const handleButtonClick = (tabID) => {
    const tabcontent = document.getElementsByClassName('tabcontent');

    for (let i = 0; i < tabcontent.length; i += 1) {
      tabcontent[i].style.display = 'none';
      tabcontent[i].classList.remove('active');
    }

    if (tabID === 'tab1') {
      tabcontent[0].style.display = 'block';
      document.getElementById('button2').classList.remove('active');
      document.getElementById('button3').classList.remove('active');
      document.getElementById('button1').classList.add('active');
    } else if (tabID === 'tab2') {
      tabcontent[1].style.display = 'block';
      document.getElementById('button1').classList.remove('active');
      document.getElementById('button3').classList.remove('active');
      document.getElementById('button2').classList.add('active');
    } else if (tabID === 'tab3') {
      tabcontent[2].style.display = 'block';
      document.getElementById('button1').classList.remove('active');
      document.getElementById('button2').classList.remove('active');
      document.getElementById('button3').classList.add('active');
    }
  };

  return (
    <div>
      <div className="tab">
        <button type="button" id="button1" onClick={() => handleButtonClick('tab1')}>Tutorial for built-in project created </button>
        <button type="button" id="button2" onClick={() => handleButtonClick('tab2')}>Connection details</button>
        <button type="button" id="button3" onClick={() => handleButtonClick('tab3')}>Connect to database via driver</button>
      </div>

      <div id="tab1" className="tabcontent">
        <div className="containertutorialTab">
          <div className="tutorialtab">
            <h2>
              <div style={{ fontSize: '20px' }}>
                <MainModal />
                to View
                <br />
                Tutorial Guide
              </div>
            </h2>
          </div>
        </div>
      </div>

      <div id="tab2" className="tabcontent">
        <div className="container">
          <div className="div1">
            <h3 className="connectionDetails">Username:</h3>
            <h3 className="connectionDetails">Password:</h3>
          </div>
          <div className="div2">
            <h3 className="connectionDetails">IP Address:</h3>
            <h3 className="connectionDetails">Port:</h3>
          </div>
        </div>
        <hr />
        <h3 className="connectionDetails">JDBC URL:</h3>
      </div>

      <div id="tab3" className="tabcontent">
        <GuidePages />
      </div>
    </div>
  );
};

export default TutorialGuideTab;
