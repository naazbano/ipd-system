

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Calendar, Activity, ChevronDown } from 'lucide-react'; 
import { BACKEND_URL } from '../utils/utils';


const AdmissionForm = () => {
  const [patient, setPatient] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    status: 'Admitted', 
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/admissions`, patient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Patient Admitted Successfully!');
      // Reset form
      setPatient({ 
        patientName: '', 
        age: '', 
        gender: 'Male', 
        status: 'Admitted', 
        admissionDate: new Date().toISOString().split('T')[0] 
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to admit patient');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patient Admission</h2>
          <p className="text-gray-500 mt-2">Fill in the details to register a new patient in the IPD system.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Patient Name */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Patient Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="e.g. Sabiya" 
                  value={patient.patientName} 
                  onChange={(e) => setPatient({...patient, patientName: e.target.value})} 
                  required 
                />
              </div>
            </div>

            {/* Age */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Age</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="25" 
                value={patient.age} 
                onChange={(e) => setPatient({...patient, age: e.target.value})} 
                required 
              />
            </div>

        
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Gender</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={patient.gender} 
                  onChange={(e) => setPatient({...patient, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Admission Status</label>
              <div className="relative">
                <Activity className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={patient.status} 
                  onChange={(e) => setPatient({...patient, status: e.target.value})}
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            
            <div className="md:col-span-2 flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Admission Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={patient.admissionDate} 
                  onChange={(e) => setPatient({...patient, admissionDate: e.target.value})} 
                  required 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
          >
            Confirm Admission
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;