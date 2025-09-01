// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import CreateCard from './components/Card/CreateCard';
import UserCard from './components/Card/UserCard';
import PublicCard from './components/Card/PublicCard';
import Navbar from './components/Common/Navbar';
import PrivateRoute from './utils/PrivateRoute';
import './Styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/create-card" element={
                <PrivateRoute>
                  <CreateCard />
                </PrivateRoute>
              } />
              <Route path="/my-card" element={
                <PrivateRoute>
                  <UserCard />
                </PrivateRoute>
              } />
              <Route path="/card/:userId" element={<PublicCard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;