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
import EmployerProfile from "./pages/employer/EmployerProfile";
import CandidateDetails from "./pages/employer/CandidateDetails";
import CandidateProfile from './pages/candidate/CandidateProfile';
import CandidateLogin from "./pages/candidate/Login";
import CandidateRegister from "./pages/candidate/Register";
import CandidateHome from "./pages/candidate/Home";
import CandidateJobDetail from "./pages/candidate/JobDetail";
import HeaderCandidate from "./components/HeaderCandidate";
import CandidateLayout from "./components/CandidateCardLayout"
import Header from "./components/Header";
import CandidateCompanies from "./pages/candidate/Companies";
import CandidateCompanyDetail from "./pages/candidate/CompanyDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        
          <Routes>
            <Route path="/employer/login" element={<Login />} />
            <Route path="/employer/register" element={<Register />} />

            {/* <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute role="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            /> */}

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
          <Route path="/employer/profile/details" element={<EmployerProfile />} />


          

            <Route path="/candidate/:id" element={<CandidateDetails />} />
            <Route path="/candidate/profile/details" element={<CandidateProfile />} />



         

          <Route element={<CandidateLayout />}>
            <Route path="/" element={<CandidateHome />} />
            <Route path="/jobs/:id" element={<CandidateJobDetail />} />
            <Route path="/candidate/companies" element={<CandidateCompanies />} />
            <Route path="/candidate/companies/:id" element={<CandidateCompanyDetail />} />
            <Route path="/candidate/register" element={<CandidateRegister />} />
            <Route path="/candidate/login" element={<CandidateLogin />} />
            
          </Route>
            
          
          <Route path="/unauthorized" element={<h2>Không có quyền truy cập</h2>} />
          </Routes>
  
      </Router>
    </AuthProvider>
  );
}

export default App;