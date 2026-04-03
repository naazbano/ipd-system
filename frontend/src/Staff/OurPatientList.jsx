import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, User, ExternalLink, ReceiptIndianRupee } from 'lucide-react';

const OurPatientsList = () => {
    const { token } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/admissions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(res.data);
            } catch (err) {
                console.error("Error fetching patients", err);
            }
        };
        if (token) fetchPatients();
    }, [token]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Our Patients List</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or ID..." 
                        className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-72"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr className="text-gray-400 text-[12px] font-bold uppercase tracking-widest">
                            <th className="px-8 py-5">Patient Name</th>
                            <th className="px-8 py-5">Age / Gender</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5">Current Bill</th>
                            <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {patients.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50/40 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                            <User size={18} />
                                        </div>
                                        <span className="font-bold text-gray-700">{p.patientName}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-gray-600 font-medium">
                                    {p.age} Yrs / {p.gender}
                                </td>
                                <td className="px-8 py-5">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold">
                                        {p.status || 'In Treatment'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 font-bold text-gray-800">
                                    ₹{p.totalBill || 0}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition">
                                            <ExternalLink size={14} /> View
                                        </button>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition">
                                            <ReceiptIndianRupee size={14} /> Bill
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {patients.length === 0 && (
                    <div className="p-20 text-center text-gray-400 italic">No patient records available.</div>
                )}
            </div>
        </div>
    );
};

export default OurPatientsList;