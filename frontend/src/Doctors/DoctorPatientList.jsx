

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {  ReceiptIndianRupee, Stethoscope } from 'lucide-react';
import { BACKEND_URL } from '../utils/utils';


const DoctorPatientList = () => {
    const { token ,user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
           


    const userRole = user?.role?.toLowerCase() || 'doctor';
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/admissions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(res.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };
        if(token) fetchPatients();
    }, [token]);

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Patient Management</h1>
                <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {patients.length} Patients Active
                </span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map(p => (
                    <div key={p._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 group">
                    
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl border border-indigo-100">
                                {p.patientName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{p.patientName}</h3>
                                <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-tighter">
                                    {p.age} Yrs • {p.gender}
                                </p>
                            </div>
                        </div>

                    
                        <div className="space-y-3">
                        
                           <button 
    onClick={() => navigate(`/${userRole}/add-service/${p._id}`)}
    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100"
>
    <Stethoscope size={18} /> Add Treatment
</button>
<button 
    onClick={() => navigate(`/${userRole}/generate-bill/${p._id}`)}
    className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
>
    <ReceiptIndianRupee size={18} /> Generate Final Bill
</button>
                        </div>
                    </div>
                ))}
            </div>

            {patients.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium italic text-lg">No active admissions found.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorPatientList;