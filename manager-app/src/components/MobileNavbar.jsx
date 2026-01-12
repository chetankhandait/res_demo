import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, LogOut, AlertCircle } from 'lucide-react';

const MobileNavbar = ({ onLogout }) => {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/station-monitor', icon: AlertCircle, label: 'Kitchen' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 z-50">
      <div className="flex items-center gap-3 p-3 overflow-x-auto no-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border shrink-0 ${
                isActive 
                  ? 'bg-green-600 text-white border-green-500 shadow-lg' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`
            }
          >
            <link.icon size={16} />
            <span className="text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}

        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap bg-slate-800 text-red-400 border border-slate-700 hover:bg-slate-700 transition-colors shrink-0 ml-auto"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavbar;
