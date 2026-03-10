import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Megaphone, Users, Trash2, Edit } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Announcement Form
  const [annData, setAnnData] = useState({ title: '', description: '', priority: 'Normal', isPinned: false });

  useEffect(() => {
    if (user.role === 'Management') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [usersRes, annRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/announcements`)
      ]);
      setUsers(usersRes.data);
      setAnnouncements(annRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/announcements`, annData);
      setAnnData({ title: '', description: '', priority: 'Normal', isPinned: false });
      fetchAdminData();
      alert("Announcement created!");
    } catch (error) {
      console.error(error);
    }
  };

  if (user.role !== 'Management') {
    return <div className="p-8 text-center text-red-600 font-bold">Access Denied</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopNavbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
            <p className="text-gray-500 mt-1">Manage users and platform announcements.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Create Announcement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Megaphone className="text-blue-600"/> Create Announcement
              </h2>
              <form onSubmit={createAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" required value={annData.title} onChange={e => setAnnData({...annData, title: e.target.value})} className="w-full border p-2 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea required value={annData.description} onChange={e => setAnnData({...annData, description: e.target.value})} rows="3" className="w-full border p-2 rounded-lg"></textarea>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select value={annData.priority} onChange={e => setAnnData({...annData, priority: e.target.value})} className="w-full border p-2 rounded-lg bg-white">
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div className="flex items-center mt-6">
                    <input type="checkbox" id="pinned" checked={annData.isPinned} onChange={e => setAnnData({...annData, isPinned: e.target.checked})} className="mr-2" />
                    <label htmlFor="pinned" className="text-sm font-medium text-gray-700">Pin to Dashboard</label>
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">Publish Announcement</button>
              </form>
            </div>

            {/* List Announcements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Announcements</h2>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {announcements.map(ann => (
                  <div key={ann._id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{ann.title}</h3>
                      <div className="flex gap-2">
                        {ann.isPinned && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">Pinned</span>}
                        {ann.priority === 'Urgent' && <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Urgent</span>}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{ann.description}</p>
                    <p className="text-xs text-gray-400 mt-2">By {ann.createdBy?.name} • {new Date(ann.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-blue-600"/> Platform Users
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{u.rollNumber}</td>
                      <td className="px-6 py-4 text-gray-700">{u.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${u.role === 'Student' ? 'bg-blue-100 text-blue-700' : u.role === 'Graduate' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
