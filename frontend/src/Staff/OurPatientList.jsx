import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    Search,  ReceiptIndianRupee, 
    Calendar, Activity, Wallet, Users 
} from 'lucide-react';
import { BACKEND_URL } from '../utils/utils';

const OurPatientsList = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/admissions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(res.data,"resdata")
                setPatients(res.data);
            } catch (err) {
                console.error("Error fetching patients", err);
            }
        };
        if (token) fetchPatients();
    }, [token]);

    const filteredPatients = patients.filter(p => 
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id.toLowerCase().includes(searchTerm.toLowerCase())
    );


     const handleViewInvoice = (id) => {
    const role = user?.role?.toLowerCase();
    
    
    const roleRoutes = {
        admin: 'admin',
        staff: 'staff',
        doctor: 'doctor'
    };

    const baseRoute = roleRoutes[role] || 'staff'; 
    navigate(`/${baseRoute}/invoice/${id}`);
};

    return (
        <div className="space-y-8 p-4">
            {/* --- Top Stats Summary --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Now', value: patients.filter(p => p.status !== 'Discharged').length, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Discharged', value: patients.filter(p => p.status === 'Discharged').length, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Total Revenue', value: `₹${patients.reduce((acc, p) => acc + (p.totalBill || 0), 0)}`, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl font-black text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Header & Search --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Patient Directory</h1>
                    <p className="text-gray-400 font-medium">Manage and view all patient medical billing records</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search name, ID or status..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    />
                </div>
            </div>

            {/* --- Main Table --- */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-[0.1em] border-b border-gray-100">
                                <th className="px-8 py-6">Patient Details</th>
                                <th className="px-6 py-6">Admission Date</th>
                                <th className="px-6 py-6">Services</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-6 py-6">Total Bill</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPatients.map((p) => (
                                <tr key={p._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-indigo-200">
                                                {p.patientName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-base">{p.patientName}</p>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                                                    {p.age} Yrs • {p.gender} • ID: {p._id.slice(-6)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-sm font-bold text-gray-600">
                                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center text-[10px] font-black">
                                                {p.services?.length || 0}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 uppercase">Items</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                            p.status === 'Discharged' 
                                            ? 'bg-green-50 text-green-600 border-green-100' 
                                            : 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse'
                                        }`}>
                                            {p.status || 'In Treatment'}
                                        </span>
                                    </td>
                                   <td className="px-6 py-6 text-indigo-600 font-black text-lg">
    ₹{(p.billInfo?.[0]?.grandTotal || 0).toLocaleString('en-IN')}
</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            
                                            <button 
                                                onClick={() => handleViewInvoice(p._id)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                                            >
                                                <ReceiptIndianRupee size={16} /> Invoice
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredPatients.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-bold text-lg">No matching patient records found</p>
                        <p className="text-gray-300 text-sm">Try searching with a different name or admission ID</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OurPatientsList;