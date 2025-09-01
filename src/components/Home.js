// src/components/Home.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Digital Business Cards</h1>
        <p>Create and share your professional digital business card with customers</p>
      </div>

      {user ? (
        <div className="user-actions">
          <Link to={user.hasCard ? "/my-card" : "/create-card"} className="primary-btn">
            {user.hasCard ? "View Your Card" : "Create Your Card"}
          </Link>
          {user.hasCard && (
            <Link to="/create-card" className="secondary-btn">
              Edit Card
            </Link>
          )}
        </div>
      ) : (
        <div className="guest-actions">
          <Link to="/signup" className="primary-btn">
            Get Started
          </Link>
          <Link to="/signin" className="secondary-btn">
            Sign In
          </Link>
        </div>
      )}

      <div className="features-section">
        <h2>Why Use Digital Cards?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Always Accessible</h3>
            <p>Your card is available 24/7 through a simple link</p>
          </div>
          <div className="feature-card">
            <h3>Easy to Update</h3>
            <p>Change your information anytime without reprinting</p>
          </div>
          <div className="feature-card">
            <h3>Environmentally Friendly</h3>
            <p>Reduce paper waste with digital solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;