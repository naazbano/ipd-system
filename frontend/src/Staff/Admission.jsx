
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';

const AdmissionsList = () => {
    const { token } = useContext(AuthContext);
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        if(token) getAdmissions();
    }, [token]);

    return (
        <div className="space-y-6">
            {/* Top Bar: Search & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by patient name..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                        + New Admission
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Recent Patient Records</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 text-[13px] font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">Patient Details</th>
                                <th className="px-6 py-4">Age / Gender</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {admissions.map((patient) => (
                                <tr key={patient._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {patient.patientName.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-700">{patient.patientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {patient.age}Y <span className="text-gray-300 mx-1">|</span> {patient.gender}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {patient.contactNumber || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                                            patient.status === 'Discharged' 
                                            ? 'bg-gray-100 text-gray-600' 
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                            {patient.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-3 text-gray-400 hover:text-gray-600">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="p-20 text-center text-gray-400 animate-pulse">
                        Fetching patient records...
                    </div>
                )}

                {!loading && admissions.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                            <Search className="text-gray-300" size={30} />
                        </div>
                        <p className="text-gray-500 font-medium">No patient records found</p>
                        <p className="text-gray-400 text-sm">Add a new admission to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdmissionsList;