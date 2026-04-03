
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';

const AdmissionsList = () => {
    
    const { token, user } = useContext(AuthContext); 
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'Admin'; 

    const getAdmissions = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/admissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmissions(res.data);
        } catch (err) {
            console.error("Error fetching list", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(token) getAdmissions();
    }, [token]);

    // Delete Function (Admin Only)
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`http://localhost:4000/api/admissions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // List update karein bina refresh kiye
                setAdmissions(admissions.filter(item => item._id !== id));
                alert("Deleted successfully");
            } catch (err) {
                alert(err.response?.data?.message || "Error deleting record");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Bar (Same as before) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm" />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm hover:bg-gray-100 transition"><Filter size={16} /> Filter</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">+ New Admission</button>
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50"><h2 className="text-lg font-bold text-gray-800">Recent Patient Records</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 text-[13px] font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">Patient Details</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {admissions.map((patient) => (
                                <tr key={patient._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">{patient.patientName.charAt(0)}</div>
                                            <span className="font-semibold text-gray-700">{patient.patientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase">{patient.status || 'Active'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Details"><Eye size={18} /></button>
                                            
                                            {/* ADMIN ONLY BUTTONS */}
                                            {isAdmin && (
                                                <>
                                                    <button 
                                                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition" 
                                                        title="Edit"
                                                        onClick={() => {/* handle edit logic */}}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button 
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                                                        title="Delete"
                                                        onClick={() => handleDelete(patient._id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                            
                                            <button className="p-3 text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdmissionsList;