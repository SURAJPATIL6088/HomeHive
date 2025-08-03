import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContactUs from './components/Contact';
import Feedback from "./components/Feedback"
import Login from './components/Login';
import Signup from "./components/Register";
import TeamMembers from './components/Team';
import './App.css';

function App() {
  return (
    <Router>
      <header className="navbar">
        <h2 className="logo">🏠 HomeHive</h2>
        <nav className="nav-links">
          <Link to="/">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/feedback">Feedback</Link>
          <Link to="/team">Team</Link>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/team" element={<TeamMembers />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;