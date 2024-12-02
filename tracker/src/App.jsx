// frontend/src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/admin' element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
