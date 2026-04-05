import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Activity, Clock,  Search, Filter } from 'lucide-react';
import { BACKEND_URL } from '../utils/utils';


const LayoutDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                
                const res = await axios.get(`${BACKEND_URL}/admissions/`);
                setPatients(res.data);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { label: "Today's Admissions", value: patients.length, icon: <Users size={20} />, color: 'bg-blue-500', trend: '+2 from yesterday' },
        { label: 'Pending Bills', value: '₹1,43,300', icon: <Clock size={20} />, color: 'bg-orange-500', trend: '6 patients' },
        { label: 'Available Beds', value: '23', icon: <Activity size={20} />, color: 'bg-green-500', trend: 'of 60 total' },
    ];

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-[#F8F9FB] min-h-screen animate-in fade-in duration-500">
            
   
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 font-medium text-sm">Overview of today's hospital activity</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Patient Name / ID..." 
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

       
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
                            <p className="text-[10px] text-gray-400 font-medium">{stat.trend}</p>
                        </div>
                        <div className={`p-4 rounded-2xl text-white ${stat.color} bg-opacity-90 shadow-lg shadow-gray-100`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>


            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-800">Patient Status</h2>
                    <span className="text-gray-400 text-sm font-bold">{patients.length} patients</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-widest border-b border-gray-50">
                                <th className="px-8 py-5">Patient</th>
                                <th className="px-8 py-5">Age / Gender</th>
                                <th className="px-8 py-5">Admitted On</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {patients.map((patient) => (
                                <tr key={patient._id} className="hover:bg-gray-50/50 transition-colors group">
                                
                                    <td className="px-8 py-5">
                                        <div>
                                            <p className="font-bold text-blue-600 hover:underline cursor-pointer">{patient.patientName}</p>
                                        </div>
                                    </td>
                           
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-gray-700">{patient.age} Yrs</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{patient.gender}</p>
                                    </td>

                             
                                    <td className="px-8 py-5 font-bold text-gray-600 text-sm">
                                        {new Date(patient.admissionDate).toLocaleDateString('en-GB', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>

                              
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${
                                            patient.status === 'Admitted' ? 'bg-green-50 text-green-600' :
                                            patient.status === 'Critical' ? 'bg-red-50 text-red-600' :
                                            'bg-orange-50 text-orange-600'
                                        }`}>
                                            {patient.status || 'Admitted'}
                                        </span>
                                    </td>

                        
                                    <td className="px-8 py-5 text-right">
                                        <button className="text-gray-300 group-hover:text-gray-600 font-black text-xl">
                                            •••
                                        </button>
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

export default LayoutDashboard;