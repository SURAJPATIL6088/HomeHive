import { Routes, Route, Navigate } from 'react-router-dom'; 
import Dashboard from './Components/AdminSection/Dashboard';
import SignupForm from './Components/Layouts/SignupForm';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/*" element={<Dashboard />} />
    </Routes>
  );
}

export default App; // ✅ This line is crucial

