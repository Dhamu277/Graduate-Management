import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  Megaphone,
  UserCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <GraduationCap className="text-blue-500" /> AlumNet
        </h2>
      </div>
      
      <div className="px-6 py-4 border-b border-gray-100 mb-4">
        <p className="font-semibold text-gray-800">{user.name}</p>
        <p className="text-xs text-gray-500 uppercase font-semibold mt-1">{user.role}</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        
        <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
          <UserCircle size={20} /> My Profile
        </NavLink>
        
        <NavLink to="/directory" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
          <Users size={20} /> Alumni Directory
        </NavLink>
        
        <NavLink to="/mentorships" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
          <Briefcase size={20} /> Mentorships
        </NavLink>
        
        <NavLink to="/jobs" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
          <Briefcase size={20} /> Job Portal
        </NavLink>
        
        <NavLink to="/events" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
          <Calendar size={20} /> Events
        </NavLink>
        
        <NavLink to="/community" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
          <MessageSquare size={20} /> Community
        </NavLink>

        {user.role === 'Management' && (
          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin Tools</p>
            <NavLink to="/admin/announcements" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Megaphone size={20} /> Announcements
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Settings size={20} /> Manage Users
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={logout}
          className="flex flex-row items-center justify-center gap-2 w-full py-2.5 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

// Needed for the icon above
import { GraduationCap } from 'lucide-react';

export default Sidebar;
