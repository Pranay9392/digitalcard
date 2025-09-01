// src/components/Common/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">DigitalCard</Link>
      </div>
      
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/create-card">Create/Edit Card</Link>
            <Link to="/my-card">My Card</Link>
            <button onClick={signOut} className="sign-out-btn">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;