import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Building, Filter, UserPlus, X } from 'lucide-react';

const Directory = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    fetchDirectory();
  }, [roleFilter]);

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/profiles';
      if (roleFilter) url += `?role=${roleFilter}`;
      
      const { data } = await axios.get(url);
      setProfiles(data);
    } catch (error) {
      console.error('Failed to fetch directory', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const initiateRequest = (profileUser) => {
    setSelectedMentor(profileUser);
    setRequestMessage(`Hi ${profileUser.name}, I found your profile in the Alumni Directory and would love to ask you a few questions about your experience at ${profileUser.currentCompany || 'your company'}. Would you be open to a brief mentorship connection?`);
    setShowRequestModal(true);
  };

  const submitDirectRequest = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/mentorships/request-direct/${selectedMentor._id}`, { message: requestMessage }, config);
      alert("Mentorship request sent successfully!");
      setShowRequestModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopNavbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
              <p className="text-gray-500">Discover and connect with alumni from around the world.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by name, company, skill..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              </div>
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="Graduate">Graduates (Alumni)</option>
                <option value="Student">Students</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.map((profile) => (
                <div key={profile._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                  <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col">
                    <div className="w-16 h-16 rounded-full border-4 border-white bg-white mx-auto -mt-8 mb-3 overflow-hidden shadow-sm flex items-center justify-center text-xl font-bold text-blue-600">
                      {profile.profileImage ? (
                        <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : profile.user?.name?.charAt(0)}
                    </div>
                    
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{profile.user?.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{profile.jobTitle ? `${profile.jobTitle}` : profile.user?.role}</p>
                      {profile.currentCompany && (
                         <p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-full mt-1.5 line-clamp-1">@ {profile.currentCompany}</p>
                      )}
                    </div>
                    
                    <div className="mt-auto space-y-2 mb-4">
                      {profile.location && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                          <MapPin size={12} /> {profile.location}
                        </div>
                      )}
                    </div>

                    <button className="w-full py-2 border border-blue-200 text-blue-700 font-medium hover:bg-blue-50 rounded-lg text-sm transition-colors mb-2">
                      View Profile
                    </button>
                    {user.role === 'Student' && profile.user?.role === 'Graduate' && (
                      <button 
                         onClick={() => initiateRequest(profile.user)}
                         className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <UserPlus size={16} /> Request Mentorship
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl text-center border border-gray-100 shadow-sm">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-1">No profiles found</h3>
              <p className="text-gray-500">We couldn't find any users matching your search criteria.</p>
            </div>
          )}

        </main>
      </div>

      {/* Direct Mentorship Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Request Mentorship</h2>
              <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={submitDirectRequest} className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  You are sending a direct mentorship request to <span className="font-bold text-gray-900">{selectedMentor.name}</span>. They will receive your message and can choose to accept or decline the connection.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to Mentor *</label>
                <textarea 
                  required
                  rows="5" 
                  value={requestMessage} 
                  onChange={e => setRequestMessage(e.target.value)} 
                  className="w-full border p-3 text-sm rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowRequestModal(false)} className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
                  <UserPlus size={16} /> Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;
