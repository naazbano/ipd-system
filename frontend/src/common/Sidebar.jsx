

import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ClipboardList, LogOut, HeartPulse, Users, UserCog, IndianRupee, ReceiptIndianRupee } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  // Role based menu items logic
  let menuItems = [];

  if (user?.role === 'Admin') {
    menuItems = [
      { name: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={22} /> },
      { name: 'Manage Staff', path: '/admin/manage-staff', icon: <UserCog size={22} /> },
       { name: 'New Admission', path: '/admin/admission-form', icon: <UserPlus size={22} /> },
      { name: 'All Admissions', path: '/admin/all-admissions', icon: <ClipboardList size={22} /> },
       { name: 'Patient Queue', path: '/admin/patients', icon: <Users size={22} /> },
  
      { name: 'Revenue Reports', path: '/admin/revenue', icon: <IndianRupee size={22} /> },
    ];
  } else if (user?.role === 'Doctor') {
    menuItems = [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: <LayoutDashboard size={22} /> },
      { name: 'Patient Queue', path: '/doctor/patients', icon: <Users size={22} /> },
      { name: 'All Bills', path: '/doctor/all-bills', icon: <ReceiptIndianRupee size={22} /> },
    ];
  } else {
    menuItems = [
      { name: 'Dashboard', path: '/staff/dashboard', icon: <LayoutDashboard size={22} /> },
      { name: 'New Admission', path: '/staff/admission-form', icon: <UserPlus size={22} /> },
      { name: 'All Admissions', path: '/staff/all-admissions', icon: <ClipboardList size={22} /> },
      { name: 'Our Patients', path: '/staff/our-patients', icon: <Users size={22} /> },
    ];
  }

  // Admin ke liye Red theme aur baki ke liye Blue theme
  const activeBg = user?.role === 'Admin' ? 'bg-blue-600 shadow-blue-100' : 'bg-blue-600 shadow-blue-100';

  return (
    <div className="w-72 bg-white h-screen flex flex-col border-r border-gray-100 sticky top-0 shadow-sm">
      <div className="p-8 flex items-center gap-3">
        <div className={`${user?.role === 'Admin' ? 'bg-blue-600' : 'bg-blue-600'} p-2 rounded-xl shadow-lg`}>
          <HeartPulse className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-gray-800">Hospital Pro</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path}
              className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all ${
                isActive ? `${activeBg} text-white shadow-lg` : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user?.role === 'Admin' ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center space-x-4 px-4 py-3 text-blue-500 hover:bg-blue-50 rounded-2xl font-bold transition-colors">
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;