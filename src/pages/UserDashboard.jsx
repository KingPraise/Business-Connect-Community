import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
// Import mock data for fallback
import { initialEvents } from '../data/mockEvents';

export default function UserDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }

    // In a real app, we would fetch the user's RSVPs from Firestore here:
    // const q = query(collection(db, "rsvps"), where("userId", "==", user.uid));
    // For now, if there is no Firebase setup, we mock it by returning the first 2 events
    if (user) {
      setRsvps([initialEvents[0], initialEvents[1]]);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-bcc-dark flex items-center justify-center text-white">Loading...</div>;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bcc-dark text-white">
      <Helmet>
        <title>My Dashboard | Business Connect Community</title>
      </Helmet>
      <Header />
      
      <main className="flex-grow pt-24 pb-20 container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">My Tickets</h1>
            <p className="text-bcc-muted">Manage your event registrations and RSVPs</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 pr-4 rounded-full border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bcc-yellow to-orange-500 flex items-center justify-center font-bold text-bcc-dark">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-sm">
              <p className="font-medium">{user?.email || 'user@example.com'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="ml-4 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Ticket className="w-6 h-6 text-bcc-yellow" />
            <h2 className="text-xl font-bold">Upcoming Events ({rsvps.length})</h2>
          </div>

          {rsvps.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">No tickets yet</h3>
              <p className="text-gray-400 mb-6">You haven't RSVP'd to any upcoming events.</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-bcc-yellow text-bcc-dark px-6 py-2.5 rounded-full font-medium hover:bg-yellow-400 transition-colors"
              >
                Discover Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rsvps.map((event, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={event.id}
                  className="group flex flex-col sm:flex-row gap-6 bg-bcc-card hover:bg-white/5 border border-white/5 hover:border-bcc-yellow/30 rounded-2xl p-4 transition-all cursor-pointer"
                >
                  <img 
                    src={event.imageUrl} 
                    alt={event.name} 
                    className="w-full sm:w-40 h-32 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-grow py-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-medium text-bcc-yellow bg-bcc-yellow/10 px-2.5 py-1 rounded-full mb-3 inline-block">
                          {event.category}
                        </span>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-bcc-yellow transition-colors">{event.name}</h3>
                      </div>
                      <button className="hidden sm:flex w-8 h-8 rounded-full bg-white/5 items-center justify-center group-hover:bg-bcc-yellow group-hover:text-bcc-dark transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="truncate max-w-[150px]">{event.location.area}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
