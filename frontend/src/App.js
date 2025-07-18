import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/candidate/Dashboard';
import EmployerDashboard from './pages/employer/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import JobDetail from './pages/employer/JobDetails';
import EditJob from './pages/employer/EditJob';
import CreateJob from "./pages/employer/CreateJob";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute role="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/employer/jobs/:id/edit" element={<EditJob />} />
          <Route path="/employer/jobs/:id" element={<JobDetail />} />
          <Route path="/employer/jobs/create" element={<CreateJob />} />


          <Route path="*" element={<h2>404 Not Found</h2>} />
          <Route path="/unauthorized" element={<h2>Không có quyền truy cập</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;