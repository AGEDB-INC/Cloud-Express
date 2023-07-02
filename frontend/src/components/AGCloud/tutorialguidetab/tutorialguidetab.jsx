import React, { useEffect } from 'react';
import './tutorialguidetab.css';
import PropTypes from 'prop-types';
import MainModal from '../Modal/Modal';
import GuidePages from '../GuidePage/guidepage';

const TutorialGuideTab = ({ selectedTab }) => {
  const handleButtonClick = (tabID) => {
    const tabcontent = document.getElementsByClassName('tabcontent');

    for (let i = 0; i < tabcontent.length; i += 1) {
      tabcontent[i].style.display = 'none';
      tabcontent[i].classList.remove('active');
    }

    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');

    if (tabID === 'tab1') {
      tabcontent[0].style.display = 'block';
      button1.classList.add('active');
      button2.classList.remove('active');
      button3.classList.remove('active');
    } else if (tabID === 'tab2') {
      tabcontent[1].style.display = 'block';
      button1.classList.remove('active');
      button2.classList.add('active');
      button3.classList.remove('active');
    } else if (tabID === 'tab3') {
      tabcontent[2].style.display = 'block';
      button1.classList.remove('active');
      button2.classList.remove('active');
      button3.classList.add('active');
    }
  };

  useEffect(() => {
    handleButtonClick(selectedTab);
  }, [selectedTab]);

  return (
    <div>
      <div className="tab">
        <button type="button" id="button1" onClick={() => handleButtonClick('tab1')}>Tutorial for built-in project created</button>
        <button type="button" id="button2" onClick={() => handleButtonClick('tab2')}>Connection details</button>
        <button type="button" id="button3" onClick={() => handleButtonClick('tab3')}>Connect to database via driver</button>
      </div>

      <div id="tab1" className="tabcontent">
        <div>
          {selectedTab === '' ? (
            <>
              <div className="containertutorialTab">
                <div className="tutorialtab">
                  <h5>
                    <div>
                      <MainModal />
                      to View
                      <br />
                      Tutorial Guide
                    </div>
                  </h5>
                </div>
              </div>
            </>
          ) : <GuidePages />}
        </div>
      </div>

      <div id="tab2" className="tabcontent">
        <div className="container">
          <div className="div1">
            <h3 className="connectionDetails">Username: ua5244cb8de892c866edde15e39a5fdef</h3>
            <h3 className="connectionDetails">Password: pde0758ff60346060121ac198c184c229</h3>
          </div>
          <div className="div2">
            <h3 className="connectionDetails">IP Address: 192.168.10.1</h3>
            <h3 className="connectionDetails">Port: 5432</h3>
          </div>
        </div>
        <hr />
        <h3 className="connectionDetails">
          JDBC URL: jdbc:postgresql://211.45.163.31:5432/d8b98b995a8262fbf95226282ae442a9c
        </h3>
      </div>

      <div id="tab3" className="tabcontent" />
    </div>
  );
};

TutorialGuideTab.propTypes = {
  selectedTab: PropTypes.string.isRequired,
};

export default TutorialGuideTab;
