import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Mail, Phone, MapPin, Briefcase, Building, Link as LinkIcon, Edit2, Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/profiles/${user._id}`, config);
      setProfile(data);
      setFormData({
        email: data.email || '',
        phone: data.phone || '',
        department: data.department || '',
        batch: data.batch || '',
        currentCompany: data.currentCompany || '',
        jobTitle: data.jobTitle || '',
        skills: data.skills?.join(', ') || '',
        bio: data.bio || '',
        linkedIn: data.linkedIn || '',
        gitHub: data.gitHub || '',
        portfolio: data.portfolio || '',
        location: data.location || ''
      });
    } catch (error) {
      console.error("Profile fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/profiles/me`, formData, config);
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG and WebP formats are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setLoading(true);
      const config = { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        } 
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/profiles/upload-photo`, uploadData, config);
      fetchProfile(); // reload profile with new image
    } catch (error) {
       console.error("Error uploading image", error);
       alert(error.response?.data?.message || 'Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = ['email', 'phone', 'department', 'batch', 'currentCompany', 'jobTitle', 'bio', 'location'];
    let filled = 0;
    fields.forEach(field => {
      if (profile[field]) filled++;
    });
    if (profile.skills && profile.skills.length > 0) filled++;
    return Math.round((filled / (fields.length + 1)) * 100);
  };

  if (loading) return (
    <div className="flex bg-gray-50 h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 flex items-center justify-center">Loading profile...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopNavbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Cover & Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 relative">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-16 mb-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold overflow-hidden shadow-lg">
                    {profile?.profileImage ? (
                      <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : user.name.charAt(0)}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white mb-1" />
                    <span className="text-white text-xs font-bold">Upload</span>
                  </div>
                  <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg, image/jpg, image/webp" />
                </div>
                
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-colors border border-blue-200">
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 text-lg">{profile?.jobTitle ? profile.jobTitle : 'Student'} {profile?.currentCompany ? `at ${profile.currentCompany}` : ''}</p>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {profile?.location || 'Add location'}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-gray-400" /> {profile?.department || 'Add department'}</span>
                  <span className="flex items-center gap-1.5"><GraduationCap size={16} className="text-gray-400" /> Batch {profile?.batch || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Completion Bar */}
            <div className="bg-blue-50/50 px-8 py-4 border-t border-gray-100 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Profile Completion</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${calculateCompletion()}%` }}></div>
              </div>
              <span className="text-sm font-bold text-blue-600">{calculateCompletion()}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (About & Details) */}
            <div className="lg:col-span-2 space-y-8">
              {isEditing ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-bold mb-6 border-b pb-4">Edit Profile Information</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2.5 rounded-lg" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2.5 rounded-lg" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border p-2.5 rounded-lg" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Batch</label><input type="text" name="batch" value={formData.batch} onChange={handleChange} className="w-full border p-2.5 rounded-lg" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label><input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} className="w-full border p-2.5 rounded-lg" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label><input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full border p-2.5 rounded-lg" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border p-2.5 rounded-lg" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label><input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange} className="w-full border p-2.5 rounded-lg" /></div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                      <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About</label>
                      <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full border p-2.5 rounded-lg"></textarea>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Save Changes</button>
                      <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">About Me</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {profile?.bio || 'You haven\'t added a bio yet. Editing your profile adds value to your network!'}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No skills listed</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column (Contact & Links) */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg"><Mail size={18} className="text-gray-500" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium text-gray-900">{profile?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg"><Phone size={18} className="text-gray-500" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{profile?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Social Links</h3>
                <div className="space-y-3">
                  {profile?.linkedIn && (
                    <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-blue-600 hover:underline">
                      <LinkIcon size={16} /> LinkedIn Profile
                    </a>
                  )}
                  {profile?.gitHub && (
                    <a href={profile.gitHub} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-800 hover:underline">
                      <LinkIcon size={16} /> GitHub Profile
                    </a>
                  )}
                  {!profile?.linkedIn && !profile?.gitHub && (
                    <p className="text-gray-500 text-sm">No social links added.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// Needed for icons
import { GraduationCap } from 'lucide-react';

export default Profile;
