import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Briefcase, MapPin, IndianRupee, Clock, Plus, Building2, Send, X, ExternalLink, Trash2 } from 'lucide-react';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobData, setJobData] = useState({
    title: '', company: '', description: '', skillsRequired: '', experience: '', location: '', jobType: 'Full-time', salary: '', applyLink: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/jobs', config);
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/jobs/${id}/apply`, { coverLetter: "I am interested in this role." }, config);
      alert("Application submitted!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit application");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, config);
      fetchJobs();
    } catch (error) {
       console.error(error);
       alert(error.response?.data?.message || "Error deleting job");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/jobs', jobData, config);
      setShowCreateModal(false);
      setJobData({ title: '', company: '', description: '', skillsRequired: '', experience: '', location: '', jobType: 'Full-time', salary: '', applyLink: '' });
      fetchJobs();
      alert("Job posted successfully!");
    } catch (error) {
       console.error(error);
       alert(error.response?.data?.message || "Error posting job");
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
              <h1 className="text-3xl font-bold text-gray-900">Job Portal</h1>
              <p className="text-gray-500 mt-1">Discover opportunities posted by alumni and partners.</p>
            </div>
            {user.role !== 'Student' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
              >
                <Plus size={18} /> Post a Job
              </button>
            )}
          </div>

          {loading ? <div className="text-gray-500">Loading jobs...</div> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map(job => (
                <div key={job._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                      <Building2 size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{job.title}</h3>
                      <p className="text-blue-600 font-medium text-sm">{job.company}</p>
                    </div>
                    <span className="ml-auto bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold tracking-wide border border-green-100">
                      {job.jobType || 'Full-time'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {job.location || 'Remote'}</div>
                    <div className="flex items-center gap-1.5"><IndianRupee size={16} className="text-gray-400" /> {job.salary || 'Competitive'}</div>
                    <div className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400" /> {job.experience || 'Entry level'}</div>
                    {(job.applyLink && job.applyLink.trim() !== '') && (
                      <div className="flex items-center gap-1.5 text-blue-600 hover:underline">
                        <ExternalLink size={16} /> 
                        <a href={job.applyLink.startsWith('http') ? job.applyLink : `https://${job.applyLink}`} target="_blank" rel="noreferrer">
                          Apply Link
                        </a>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 pr-4">{job.description}</p>
                  
                  <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      Posted by {job.postedBy?.name}
                    </div>
                    <div className="flex items-center gap-3">
                      {(user.role === 'Student' && job.applyLink && job.applyLink.trim() !== '') && (
                        <a 
                          href={job.applyLink.startsWith('http') ? job.applyLink : `https://${job.applyLink}`} target="_blank" rel="noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
                        >
                          <Send size={14} /> Apply Externally
                        </a>
                      )}

                      {(user.role === 'Student' && (!job.applyLink || job.applyLink.trim() === '')) && (
                        <button 
                          onClick={() => handleApply(job._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
                        >
                          <Send size={14} /> Apply Now
                        </button>
                      )}

                      {(user.role === 'Management' || user._id === job.postedBy?._id) && (
                        <button 
                          onClick={() => handleDelete(job._id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors border border-red-100"
                          title="Delete Post"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100 border-dashed">
                  <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No job postings available right now.</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Post a Job</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateJob} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input required type="text" value={jobData.title} onChange={e => setJobData({...jobData, title: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Frontend Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input required type="text" value={jobData.company} onChange={e => setJobData({...jobData, company: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Google" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required rows="3" value={jobData.description} onChange={e => setJobData({...jobData, description: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Job responsibilities and details..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (comma separated) *</label>
                <input required type="text" value={jobData.skillsRequired} onChange={e => setJobData({...jobData, skillsRequired: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. React, JavaScript, CSS" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
                  <input required type="text" value={jobData.experience} onChange={e => setJobData({...jobData, experience: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 0-2 Years" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input required type="text" value={jobData.location} onChange={e => setJobData({...jobData, location: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Bangalore, India (or Remote)" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                  <select required value={jobData.jobType} onChange={e => setJobData({...jobData, jobType: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
                  <input required type="text" value={jobData.salary} onChange={e => setJobData({...jobData, salary: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 12 LPA" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link (Optional)</label>
                <input type="url" value={jobData.applyLink} onChange={e => setJobData({...jobData, applyLink: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://company.com/careers/apply" />
              </div>
              
              <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
