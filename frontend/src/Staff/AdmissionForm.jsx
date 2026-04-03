import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdmissionForm = () => {
  const [patient, setPatient] = useState({
    patientName: '', age: '', gender: 'Male', contactNumber: '',
    address: '', admissionDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      await axios.post('http://localhost:4000/api/admissions', patient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Patient Admitted Successfully!');
      setPatient({ patientName: '', age: '', gender: 'Male', contactNumber: '', address: '', admissionDate: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to admit patient');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Admission Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-600">Patient Full Name</label>
          <input type="text" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
            placeholder="John Doe" value={patient.patientName} onChange={(e) => setPatient({...patient, patientName: e.target.value})} required />
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-600">Age</label>
          <input type="number" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
            placeholder="25" value={patient.age} onChange={(e) => setPatient({...patient, age: e.target.value})} required />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-600">Gender</label>
          <select className="p-3 border rounded-lg bg-white" value={patient.gender} onChange={(e) => setPatient({...patient, gender: e.target.value})}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-600">Contact Number</label>
          <input type="text" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
            placeholder="9876543210" value={patient.contactNumber} onChange={(e) => setPatient({...patient, contactNumber: e.target.value})} required />
        </div>

        <div className="col-span-2 flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-600">Address</label>
          <textarea className="p-3 border rounded-lg h-24 outline-none focus:ring-2 focus:ring-blue-400" 
            placeholder="Enter full address" value={patient.address} onChange={(e) => setPatient({...patient, address: e.target.value})} required />
        </div>
        

        <button type="submit" className="col-span-2 bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
          Submit Admission
        </button>
      </form>
    </div>
  );
};

export default AdmissionForm;