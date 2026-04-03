import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Activity, Clock, ChevronRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LayoutDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
              
                const res = await axios.get('http://localhost:4000/api/admissions/');
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
        { label: 'Total Patients', value: patients.length, icon: <Users size={20} />, color: 'bg-blue-500' },
        { label: 'Active Now', value: '12', icon: <Activity size={20} />, color: 'bg-green-500' },
        { label: 'Pending Bills', value: '08', icon: <Clock size={20} />, color: 'bg-orange-500' },
    ];

    if (loading) return <div className="p-10 text-center font-bold text-blue-600">Loading Dashboard...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Hospital Overview</h1>
                    <p className="text-gray-400 font-medium text-sm">Welcome back! Here is what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Filter size={20} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {/* 2. Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center gap-5 hover:translate-y-[-5px] transition-all duration-300">
                        <div className={`p-4 rounded-2xl text-white ${stat.color} shadow-lg shadow-gray-100`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Patient List Table (Screenshot Layout) */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-800">Recent Admissions</h2>
                    <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
                        View All <ChevronRight size={16} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
                                <th className="px-8 py-5">Patient Details</th>
                                <th className="px-8 py-5">Ward / Bed</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {patients.slice(0, 6).map((patient) => (
                                <tr key={patient._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {patient.patientName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{patient.patientName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{patient.uhid || 'IPD-0021'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-600 text-sm">
                                        {patient.wardNo || 'General'} / {patient.bedNo || 'B-12'}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-tighter">
                                            Stable
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">10:30 AM</p>
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