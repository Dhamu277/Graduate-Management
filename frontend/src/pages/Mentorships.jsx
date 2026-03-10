import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Search, Plus, UserPlus, Clock, MessageCircle, MapPin, X } from 'lucide-react';

const Mentorships = () => {
  const { user } = useAuth();
  const [mentorships, setMentorships] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // browse, my-requests, my-applications
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mentorshipData, setMentorshipData] = useState({
    title: '', description: '', category: 'Career Guidance', skills: '', availability: '', mode: 'online', contactDetails: ''
  });

  useEffect(() => {
    fetchMentorships();
    if (user.role !== 'Student') {
      fetchMyRequests();
    } else {
      fetchMyApplications();
    }
  }, [user]);

  const fetchMentorships = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/mentorships`, config);
      setMentorships(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/mentorships/requests`, config);
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/mentorships/my-applications`, config);
      setRequests(data); // Using the same requests array state for simplicity
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequest = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/mentorships/${id}/request`, { message: "I would like to be mentored by you." }, config);
      alert("Mentorship request sent successfully!");
      if (user.role === 'Student') fetchMyApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Error sending request");
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/mentorships/requests/${id}`, { status }, config);
      fetchMyRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateMentorship = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/mentorships`, mentorshipData, config);
      setShowCreateModal(false);
      setMentorshipData({ title: '', description: '', category: 'Career Guidance', skills: '', availability: '', mode: 'online', contactDetails: '' });
      fetchMentorships();
      alert("Mentorship created successfully!");
    } catch (error) {
       console.error(error);
       alert(error.response?.data?.message || "Error creating mentorship");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopNavbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mentorships</h1>
              <p className="text-gray-500 mt-1">Find a mentor or share your expertise with students.</p>
            </div>
            {user.role !== 'Student' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
              >
                <Plus size={18} /> Offer Mentorship
              </button>
            )}
          </div>

          {(user.role === 'Graduate' || user.role === 'Management') && (
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'browse' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Browse Mentors
              </button>
              <button 
                onClick={() => setActiveTab('my-requests')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'my-requests' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Requests Received
                {requests.filter(r => r.status === 'Pending').length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{requests.filter(r => r.status === 'Pending').length}</span>
                )}
              </button>
            </div>
          )}

          {user.role === 'Student' && (
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'browse' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Browse Mentors
              </button>
              <button 
                onClick={() => setActiveTab('my-applications')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'my-applications' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                My Mentorship Applications
              </button>
            </div>
          )}

          {activeTab === 'browse' && (
            loading ? <div className="text-gray-500">Loading mentorships...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentorships.map(mentor => (
                  <div key={mentor._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col transition-transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{mentor.title}</h3>
                        <p className="text-blue-600 text-sm font-medium mt-1">by {mentor.mentor?.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{mentor.mentor?.currentCompany || 'Alumni'}</p>
                      </div>
                      <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ml-2">
                        {mentor.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{mentor.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mentor.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{skill}</span>
                      ))}
                      {mentor.skills.length > 3 && <span className="text-xs text-gray-400 py-1">+{mentor.skills.length - 3}</span>}
                    </div>

                    <div className="text-xs text-gray-500 space-y-2 mb-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2"><Clock size={14} /> Availability: <span className="font-medium text-gray-700">{mentor.availability}</span></div>
                      <div className="flex items-center gap-2"><MapPin size={14} /> Mode: <span className="font-medium text-gray-700">{mentor.mode}</span></div>
                    </div>
                    
                    {user.role === 'Student' && (
                      <button 
                        onClick={() => handleRequest(mentor._id)}
                        className="w-full mt-auto bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 py-2.5 rounded-lg flex justify-center items-center gap-2 font-semibold transition-all"
                      >
                        <UserPlus size={16} /> Request Mentorship
                      </button>
                    )}
                  </div>
                ))}
                {mentorships.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100 border-dashed">
                    <UserPlus size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No mentorship opportunities available right now.</p>
                  </div>
                )}
              </div>
            )
          )}

          {activeTab === 'my-requests' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentee</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentorship Post</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map(req => (
                    <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{req.mentee?.name}</p>
                        <p className="text-xs text-gray-500">{req.mentee?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {req.mentorship ? (
                          <p className="text-sm font-medium text-gray-800">{req.mentorship.title}</p>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-blue-600">Direct Request</span>
                            {req.message && <span className="text-xs text-gray-500 italic mt-1 line-clamp-2">"{req.message}"</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {req.status === 'Pending' && (
                          <>
                            <button onClick={() => updateRequestStatus(req._id, 'Accepted')} className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">Accept</button>
                            <button onClick={() => updateRequestStatus(req._id, 'Rejected')} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No requests found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'my-applications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentorship Post</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentor</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map(req => (
                    <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {req.mentorship ? (
                          <p className="font-medium text-gray-900">{req.mentorship.title}</p>
                        ) : (
                          <p className="font-bold text-blue-600">Direct Request</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{req.mentorship ? req.mentorship.mentor?.name : req.directMentor?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">You haven't applied for any mentorships yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

      {/* Create Mentorship Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Offer Mentorship</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateMentorship} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentorship Title *</label>
                <input required type="text" value={mentorshipData.title} onChange={e => setMentorshipData({...mentorshipData, title: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Master React and Frontend Engineering" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required rows="3" value={mentorshipData.description} onChange={e => setMentorshipData({...mentorshipData, description: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="What will mentees learn?"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select required value={mentorshipData.category} onChange={e => setMentorshipData({...mentorshipData, category: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Career Guidance</option>
                    <option>Interview Prep</option>
                    <option>Technical Skills</option>
                    <option>Leadership</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode *</label>
                  <select required value={mentorshipData.mode} onChange={e => setMentorshipData({...mentorshipData, mode: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="online">Online</option>
                    <option value="offline">In-Person</option>
                    <option value="both">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Covered (comma separated) *</label>
                <input required type="text" value={mentorshipData.skills} onChange={e => setMentorshipData({...mentorshipData, skills: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. React, Node.js, System Design" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
                  <input required type="text" value={mentorshipData.availability} onChange={e => setMentorshipData({...mentorshipData, availability: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Weekends 10am-12pm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email / Info *</label>
                  <input required type="text" value={mentorshipData.contactDetails} onChange={e => setMentorshipData({...mentorshipData, contactDetails: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="mentor@example.com" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">Post Mentorship</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentorships;
