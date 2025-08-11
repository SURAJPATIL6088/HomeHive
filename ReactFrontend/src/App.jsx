import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import existing authentication and routing components
import AuthProvider from './Components/Context/AuthContext';
import ProtectedRoute, { AdminRoute, AccountantRoute, ResidentRoute, AuthRoute } from './Components/common/ProtectedRoute';
import Login from './Components/Login';
import Register from './Components/Register';
import Unauthorized from './Components/common/Unauthorized';

// Import existing dashboard components (keep your existing ones)
import AdminDashboard from "./Components/AdminSection/Dashboard";
import ResidentDashboard from "./Components/ResidentSection/Dashboard";
import AccountantDashboard from "./Components/AccountantSection/Dashboard.jsx";
import Contact from "./Components/Contact";
import Feedback from "./Components/Feedback";
import Dashboard from "./Components/Dashboard.jsx";

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import AboutUs from './Components/About.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <main style={{ minHeight: "100vh" }}>
            <Routes>
              <Route path="/" element={<AuthRoute><Dashboard /></AuthRoute>} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/about" element={<AboutUs />} />
              
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              <Route path="/register" element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              } />
              
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/accountant/*" element={
                <AccountantRoute>
                  <AccountantDashboard />
                </AccountantRoute>
              } />
              
              <Route path="/resident/*" element={
                <ResidentRoute>
                  <ResidentDashboard />
                </ResidentRoute>
              } />
              
              {/* Unauthorized access page */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
