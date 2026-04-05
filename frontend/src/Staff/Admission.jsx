
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, Eye, ChevronDown, ChevronUp, Activity, IndianRupee, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils';


const AdmissionsList = () => {


    const navigate = useNavigate();
    
    const handleEditClick = (admissionId, serviceId) => {
        navigate(`/admin/edit-service/${admissionId}/${serviceId}`);
    };
    const { token, user } = useContext(AuthContext); 
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        const getAdmissions = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/admissions`, {
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

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };
const handleDeleteService = async (admissionId, serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
        try {
    
            const res = await axios.delete(
                `${BACKEND_URL}/admissions/${admissionId}/service/${serviceId}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                
                setAdmissions(prev => prev.map(adm => {
                    if (adm._id === admissionId) {
                        return { ...adm, services: adm.services.filter(s => s._id !== serviceId) };
                    }
                    return adm;
                }));
                alert("Service deleted!");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    }
};



    return (
        <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search patient or service..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                        <Filter size={16} /> Filter
                    </button>
                   
                   
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">IPD Admissions Details</h2>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Total: {admissions.length} Patients
                    </span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Patient Info</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Total Bill</th>
                                <th className="px-6 py-4">Services</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {admissions.map((item) => (
                                <div key={item._id} className="contents"> 
                                    <tr className="hover:bg-blue-50/20 transition-colors cursor-pointer" onClick={() => toggleRow(item._id)}>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-inner">
                                                    {item.patientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{item.patientName}</p>
                                                    <p className="text-xs text-gray-500">{item.age} Yrs • {item.gender}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${
                                                item.status === 'Discharged' 
                                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            }`}>
                                                <Activity size={12} />
                                                {item.status || 'Admitted'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-gray-700 font-bold">
                                                <IndianRupee size={14} className="text-gray-400" />
                                                  {(item.billInfo?.[0]?.grandTotal || 0).toLocaleString('en-IN')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex -space-x-2">
                                                {item.services?.slice(0, 3).map((s, idx) => (
                                                    <div key={idx} className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase">
                                                        {s.serviceName.charAt(0)}
                                                    </div>
                                                ))}
                                                {item.services?.length > 3 && (
                                                    <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                                                        +{item.services.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all">
                                                {expandedRow === item._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </td>
                                    </tr>

                                    
                                    {expandedRow === item._id && (
                                        <tr className="bg-gray-50/30">
                                            <td colSpan="5" className="px-8 py-6">
                                                <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
                                                    <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                                                        <Activity size={16} /> Services Summary 
                                                        {user?.role === 'Admin' && <span className="text-[10px] font-normal text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md ml-2 border border-amber-100">Admin Mode</span>}
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {item.services?.map((service, sIdx) => (
                                                            <div key={sIdx} className="group relative flex items-center justify-between p-3 bg-blue-50/30 rounded-xl border border-blue-50/50 hover:border-blue-200 transition-all">
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-800">{service.serviceName}</p>
                                                                    <p className="text-[11px] text-gray-500">Qty: {service.qty} × ₹{service.rate}</p>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <p className="text-sm font-bold text-blue-700">₹{service.rate * service.qty}</p>
                                                                    
                                                            
                                                                    {user?.role === 'Admin' && (
                                                                        <div className="flex items-center gap-1 border-l pl-2 border-blue-100 ml-2">
                                                                           <button 
                                                                                  onClick={() => handleEditClick(item._id, service._id)}
                                                                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition"
                                                                  title="Edit Service"
                                                                      >
                                                                 <Pencil size={14} />
                                                                           </button>
                                                                            <button 
                                                                                onClick={() => handleDeleteService(item._id, service._id)}
                                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                                                                                title="Delete Service"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </div>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdmissionsList;