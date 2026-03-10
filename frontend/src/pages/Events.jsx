import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Plus, X } from 'lucide-react';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventData, setEventData] = useState({
    name: '', description: '', date: '', time: '', venue: '', category: 'Reunion', registrationLimit: ''
  });
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registrationDetails, setRegistrationDetails] = useState('');

  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendeesList, setAttendeesList] = useState([]);
  const [selectedEventName, setSelectedEventName] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`, config);
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Format data properly
      const payload = {
         ...eventData,
         registrationLimit: eventData.registrationLimit ? parseInt(eventData.registrationLimit) : null
      };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, payload, config);
      setShowCreateModal(false);
      setEventData({ name: '', description: '', date: '', time: '', venue: '', category: 'Reunion', registrationLimit: '' });
      fetchEvents();
      alert("Event created successfully!");
    } catch (error) {
       console.error(error);
       alert(error.response?.data?.message || "Error creating event");
    }
  };

  const initiateRegister = (id) => {
    setSelectedEventId(id);
    setRegistrationDetails('');
    setShowRegisterModal(true);
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/events/${selectedEventId}/register`, { details: registrationDetails }, config);
      alert("Successfully registered for the event!");
      setShowRegisterModal(false);
      fetchEvents();
    } catch (error) {
        alert(error.response?.data?.message || "Registration failed");
    }
  };

  const fetchAttendees = async (eventId, eventName) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${eventId}/attendees`, config);
      setAttendeesList(data);
      setSelectedEventName(eventName);
      setShowAttendeesModal(true);
    } catch (error) {
      alert("Failed to load attendees");
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
              <h1 className="text-3xl font-bold text-gray-900">Alumni Events</h1>
              <p className="text-gray-500 mt-1">Join webinars, reunions, and networking meets.</p>
            </div>
            {user.role === 'Management' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
              >
                <Plus size={18} /> Create Event
              </button>
            )}
          </div>

          {loading ? <div className="text-gray-500">Loading events...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map(event => {
                const eventDate = new Date(event.date);
                return (
                  <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all group">
                    <div className="h-32 bg-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 transform scale-150 rotate-12">
                         <CalendarIcon size={120} className="text-white" />
                      </div>
                      <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded text-sm font-bold shadow-sm">
                        {event.category}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex gap-4 mb-4">
                        <div className="flex flex-col items-center justify-center p-2 bg-blue-50 text-blue-700 rounded-lg min-w-[3rem] border border-blue-100">
                          <span className="text-xs font-bold uppercase">{eventDate.toLocaleString('default', { month: 'short'})}</span>
                          <span className="text-xl font-bold leading-none">{eventDate.getDate()}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight mb-1">{event.name}</h3>
                          <p className="text-xs text-blue-600 font-medium">By {event.organizer?.name}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{event.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-5">
                        <div className="flex items-center gap-2 truncate"><MapPin size={16} className="text-gray-400 shrink-0" /> <span className="truncate">{event.venue}</span></div>
                        <div className="flex items-center gap-2"><Clock size={16} className="text-gray-400 shrink-0" /> {event.time}</div>
                        {event.registrationLimit && (
                            <div className="flex items-center gap-2"><Users size={16} className="text-gray-400 shrink-0" /> Max {event.registrationLimit} attendees</div>
                        )}
                      </div>
                      
                      <div className="mt-auto flex gap-2">
                        {user.role === 'Management' && (
                          <button 
                            onClick={() => fetchAttendees(event._id, event.name)}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                            title="View Attendees"
                          >
                            <Users size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => initiateRegister(event._id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                          Register Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {events.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100 border-dashed">
                  <CalendarIcon size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No events scheduled at the moment.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                <input required type="text" value={eventData.name} onChange={e => setEventData({...eventData, name: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Annual Alumni Meet 2026" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required rows="3" value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Event details and agenda..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input required type="date" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input required type="time" value={eventData.time} onChange={e => setEventData({...eventData, time: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                <input required type="text" value={eventData.venue} onChange={e => setEventData({...eventData, venue: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Main Auditorium" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select required value={eventData.category} onChange={e => setEventData({...eventData, category: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="Webinar">Webinar</option>
                    <option value="Reunion">Reunion</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Limit (Optional)</label>
                  <input type="number" min="1" value={eventData.registrationLimit} onChange={e => setEventData({...eventData, registrationLimit: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 100" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Details Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Event Registration</h2>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={submitRegistration} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Details / Requirements</label>
                <textarea 
                  rows="4" 
                  value={registrationDetails} 
                  onChange={e => setRegistrationDetails(e.target.value)} 
                  className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Any dietary restrictions, specific interests, or notes for the organizer..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">Optional details provided will be visible to the event organizers.</p>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowRegisterModal(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendees Viewer Modal (Admin Only) */}
      {showAttendeesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Registered Attendees</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedEventName} — {attendeesList.length} total</p>
              </div>
              <button onClick={() => setShowAttendeesModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {attendeesList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No attendees registered yet.</p>
              ) : (
                <div className="space-y-4">
                  {attendeesList.map((reg) => (
                    <div key={reg._id} className="border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-gray-900">{reg.attendee?.name}</h4>
                        <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 mt-1">
                          <span>{reg.attendee?.email}</span>
                          <span className="font-medium text-blue-600">{reg.attendee?.rollNumber}</span>
                          <span className="uppercase text-xs font-bold tracking-wide mt-0.5 bg-gray-100 px-2 rounded-full">{reg.attendee?.role}</span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 sm:max-w-xs bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                        <p className="font-semibold text-gray-700 text-xs uppercase mb-1">Provided Details:</p>
                        <p className="text-gray-600 whitespace-pre-wrap">{reg.details || <span className="italic text-gray-400">None provided</span>}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
