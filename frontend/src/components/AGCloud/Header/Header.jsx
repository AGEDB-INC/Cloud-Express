import React from 'react';
import './Header.css'; // Import your CSS file

const Header = () => (
  <div className="header-title">
    <div className="header-text">
      <h2 style={{ color: 'white' }}>AGE Viewer</h2>
    </div>
    <div className="account-information">
      <h3 style={{ color: 'white' }}>Account information</h3>
    </div>
  </div>
);

export default Header;
