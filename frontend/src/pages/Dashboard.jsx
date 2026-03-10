import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, GraduationCap, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard');
        setData(res.data);
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex items-center justify-center text-gray-500">Loading dashboard data...</div>
    </div>
  );

  const stats = data?.stats || {};
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
  ]; // Mock data for chart layout

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopNavbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
            <p className="text-gray-500 mt-1">Here is what's happening in your alumni network today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Users className="text-blue-500" />} label="Total Alumni" value={stats.totalAlumni || 0} trend="+12%" />
            <StatCard icon={<TrendingUp className="text-emerald-500" />} label="Active Users" value={stats.activeUsers || 0} trend="+5%" />
            <StatCard icon={<Briefcase className="text-purple-500" />} label="Job Posts" value={stats.totalJobPosts || 0} trend="+18%" />
            <StatCard icon={<Calendar className="text-orange-500" />} label="Upcoming Events" value={stats.totalEvents || 0} trend="-2%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6 font-display">Engagement Overview</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity / Announcements */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-[22rem]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Official Announcements</h3>
                <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium">View All</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {data?.recentData?.recentAnnouncements?.length > 0 ? (
                  data.recentData.recentAnnouncements.map((ann, i) => (
                    <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        {ann.isPinned && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold tracking-wide uppercase">Pinned</span>}
                        <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{ann.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{ann.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic text-center mt-10">No recent announcements</p>
                )}
              </div>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, trend }) => {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
      <div className={`p-4 rounded-xl ${isPositive ? 'bg-blue-50' : 'bg-gray-50'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <div className="flex items-end gap-2">
          <h3 className="text-2xl font-bold text-gray-900 leading-none">{value}</h3>
          <span className={`text-xs font-semibold mb-0.5 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
