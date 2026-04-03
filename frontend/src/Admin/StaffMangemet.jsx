import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Trash2, ShieldCheck, Mail, Phone, MoreHorizontal } from 'lucide-react';

const ManageStaff = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch All Users (Doctors + Staff)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Maan lijiye aapka endpoint /api/users hai jo sabko fetch karta hai
                const res = await axios.get('http://localhost:4000/api/users');
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Delete User Logic
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name} from the system?`)) {
            try {
                await axios.delete(`http://localhost:4000/api/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                alert("Error deleting user");
            }
        }
    };

    // Filter Logic (Search by Name or Role)
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center font-bold text-red-600">Loading Staff Data...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Staff Management</h1>
                    <p className="text-sm text-gray-400 font-medium">Add, manage and monitor all hospital employees</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition">
                    <UserPlus size={20} /> Register New Member
                </button>
            </div>

            {/* Search & Stats Box */}
            <div className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by name, role or email..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase">
                        Doctors: {users.filter(u => u.role === 'Doctor').length}
                    </div>
                    <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-black uppercase">
                        Staff: {users.filter(u => u.role === 'Staff').length}
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Employee</th>
                            <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Role & Access</th>
                            <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Contact Info</th>
                            <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-red-50/20 transition-colors group">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${user.role === 'Doctor' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{user.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {user._id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={16} className={user.role === 'Doctor' ? 'text-blue-500' : 'text-orange-500'} />
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase ${
                                            user.role === 'Doctor' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail size={14} className="text-gray-300" /> {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={14} className="text-gray-300" /> {user.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => handleDelete(user._id, user.name)}
                                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStaff;