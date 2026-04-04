import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './common/Sidebar';
import StaffDashboard from'./Staff/StaffDashboard'
import AdmissionForm from './Staff/AdmissionForm';
import AdmissionsList from './Staff/Admission';
import Login from './pages/Login';G
import Register from './pages/Register';
import OurPatientsList from './Staff/OurPatientList';
import DoctorPatientList from './Doctors/DoctorPatientList';
import AddMedicalService from './Doctors/AddMedicalService';

import AddBilling from './Doctors/AddBilling';
import FinalBill from './Doctors/FinalBill';
import LayoutDashboard from './common/LayoutDashbaord';
function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role.toLowerCase()}/dashboard`} />} />
        <Route path="/" element={<Register />} />

        {/* --- STAFF ROUTES --- */}
        <Route 
          path="/staff/*" 
          element={
            user?.role === 'Staff' ? (
              <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-50 min-h-screen p-6">
                  <Routes>
                    <Route path="dashboard" element={<LayoutDashboard />} />
                   
                    <Route path="all-admissions" element={<AdmissionsList />} />
                     <Route path="admission-form" element={<AdmissionForm />} />
                      <Route path="our-patients" element={<OurPatientsList />} />                  
                  </Routes>
                </div>
              </div>
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/admin/*" 
          element={
            user?.role === 'Admin' ? (
              <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-50 min-h-screen p-6">
                  <Routes>
                    <Route path="dashboard" element={<LayoutDashboard />} />
                 
                       <Route path="patients" element={<DoctorPatientList />} />
                      <Route path="all-admissions" element={<AdmissionsList />} />
                         <Route path="add-service/:id" element={<AddMedicalService />} />
                        <Route path="add-bill/:id" element={<AddBilling />} />
                     <Route path="admission-form" element={<AdmissionForm />} />
                  </Routes>
                </div>
              </div>
            ) : <Navigate to="/login" />
          } 
        />

     
        <Route 
          path="/doctor/*" 
          element={
            user?.role === 'Doctor' ? (
              <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-50 min-h-screen p-6">
                  <Routes>
                    <Route path="dashboard" element={<LayoutDashboard />} />
               <Route path="patients" element={<DoctorPatientList />} />
                 <Route path="add-service/:id" element={<AddMedicalService />} />
                <Route path="add-bill/:id" element={<AddBilling />} />
               <Route path="invoice/:id" element={<FinalBill />} />
                  </Routes>
                </div>
              </div>
            ) : <Navigate to="/login" />
          } 
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;