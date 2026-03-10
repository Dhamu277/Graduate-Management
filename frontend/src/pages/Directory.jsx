import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Search, MapPin, Building, Filter } from 'lucide-react';

const Directory = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

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

                    <button className="w-full py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                      View Profile
                    </button>
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
    </div>
  );
};

import { Users } from 'lucide-react';
export default Directory;
