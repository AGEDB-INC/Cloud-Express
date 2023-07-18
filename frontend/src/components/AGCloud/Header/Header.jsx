import React from 'react';
import './Header.css'; // Import your CSS file
import ServerConnectionModal from '../ServerConnection/serverconnection';

const Header = () => (
  <div className="header-title">
    <div className="header-text">
      <h4 style={{ color: 'white' }}>Age Viewer</h4>
    </div>
    <div className="account-information">
      <ServerConnectionModal />
    </div>
  </div>
);

export default Header;
