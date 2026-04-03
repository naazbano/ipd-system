import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserPlus, Clock, CheckCircle, Search, Bell } from 'lucide-react';

const StaffDashboard = () => {
    const [stats, setStats] = useState({ total: 0, active: 0, today: 0 });
    const [recentAdmissions, setRecentAdmissions] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const res = await axios.get('http://localhost:4000/api/admissions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const data = res.data;
                setRecentAdmissions(data.slice(0, 5)); // Sirf top 5 dikhane ke liye
                
                setStats({
                    total: data.length,
                    active: data.filter(p => p.status === 'Admitted').length,
                    today: data.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length
                });
            } catch (err) {
                console.error("Dashboard error:", err);
            }
        };
        fetchDashboardData();
    }, []);

    const cards = [
        { title: 'Total Patients', value: stats.total, icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Today Admissions', value: stats.today, icon: <UserPlus size={24} />, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Active in IPD', value: stats.active, icon: <Clock size={24} />, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Discharged', value: '0', icon: <CheckCircle size={24} />, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="p-2 space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Staff Dashboard</h1>
                    <p className="text-gray-500 text-sm">Welcome back! Here is what's happening today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                    </div>
                    <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex flex-col gap-4">
                            <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-1">{card.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Admissions Table */}
                <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Recent Admissions</h2>
                        <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-sm font-medium border-b border-gray-50">
                                    <th className="pb-4">Patient Name</th>
                                    <th className="pb-4">Age/Gender</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentAdmissions.map((p) => (
                                    <tr key={p._id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-semibold text-gray-700">{p.patientName}</td>
                                        <td className="py-4 text-gray-500 text-sm">{p.age}Y / {p.gender}</td>
                                        <td className="py-4">
                                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                                                {p.status || 'Admitted'}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <button className="text-gray-400 group-hover:text-blue-600 transition-colors">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentAdmissions.length === 0 && <p className="text-center py-10 text-gray-400 italic">No admissions recorded yet.</p>}
                    </div>
                </div>

                {/* Side Activity Panel */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Activity Log</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full shrink-0"></div>
                            <div>
                                <p className="text-sm text-gray-800 font-medium">New patient admitted</p>
                                <p className="text-xs text-gray-500">Just now</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-2 h-2 mt-2 bg-green-500 rounded-full shrink-0"></div>
                            <div>
                                <p className="text-sm text-gray-800 font-medium">Report generated</p>
                                <p className="text-xs text-gray-500">25 mins ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;