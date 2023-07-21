/* eslint-disable */
import React from 'react';
import { Dropdown } from 'react-bootstrap'; 
import './Header.css'; 
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineLogout } from 'react-icons/ai';
import api from '../../../services/api';
import ServerConnectionModal from '../ServerConnection/serverconnection';

const Header = () => {

  
  const logOut = async (e) => {

    try {
      const response = await api.get('/user/logout', { withCredentials: true });
      if (response.status === 200) {
        console.log(response);
        window.location.assign('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="header-title">
      <div className="header-text">
        <h4 style={{ color: 'white' }}>Age Viewer</h4>
      </div>
      <div className="account-information">
        <ServerConnectionModal />
        <Dropdown className="dropdown">
          <Dropdown.Toggle id="dropdown-basic" className="dropdown">
            <FaUserCircle size={30} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={logOut}>
              <AiOutlineLogout size={20} style={{ marginRight: "5px", color: "red"}} />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
