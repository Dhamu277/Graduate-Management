import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Plus } from 'lucide-react';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events');
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/events/${id}/register`);
      alert("Successfully registered for the event!");
      fetchEvents();
    } catch (error) {
        alert(error.response?.data?.message || "Registration failed");
    }
  }

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
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
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
                      
                      <button 
                         onClick={() => handleRegister(event._id)}
                         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-auto"
                      >
                         Register Now
                      </button>
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
    </div>
  );
};

export default Events;
