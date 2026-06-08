import { useState, useMemo, useEffect } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Save, X, UploadCloud, 
  LayoutDashboard, Calendar, Settings, LogOut, TrendingUp, 
  Search, CalendarDays, Star, CreditCard, Wand2, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { extractEventDetailsFromImage } from '../lib/gemini';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [themeColor, setThemeColor] = useState(localStorage.getItem('bcc_theme_color') || '#f5c518');
  
  useEffect(() => {
    document.documentElement.style.setProperty('--bcc-yellow', themeColor);
  }, [themeColor]);
  
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const metrics = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter(e => new Date(e.date) >= new Date()).length;
    const featured = events.filter(e => e.featured).length;
    const paid = events.filter(e => e.price.type === 'Paid').length;
    return { total, upcoming, featured, paid };
  }, [events]);

  const filteredEvents = events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Login successful!');
    } else {
      toast.error('Incorrect password. Try "admin123"');
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large. Please select an image under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.6 quality to drastically speed up AI uploads
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setCurrentEvent({...currentEvent, imageUrl: compressedDataUrl});
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNew = () => {
    setCurrentEvent({
      id: `evt-${Date.now()}`,
      name: '',
      imageUrl: '',
      date: new Date().toISOString().slice(0, 16),
      location: { address: '', area: 'Ring Road' },
      category: 'Networking',
      price: { type: 'Free', amount: 0 },
      description: '',
      organizer: { name: '', contact: '' },
      rsvpLink: '',
      tags: [],
      featured: false
    });
    setIsEditing(true);
  };

  const handleAIScan = async () => {
    if (!currentEvent.imageUrl || !currentEvent.imageUrl.startsWith('data:image')) {
      toast.error("Please upload an image file first from your computer. We cannot scan external URLs yet.");
      return;
    }
    
    setIsScanning(true);
    try {
      const mimeType = currentEvent.imageUrl.substring(5, currentEvent.imageUrl.indexOf(';'));
      let storedApiKey = localStorage.getItem('BCC_GEMINI_API_KEY');
      
      let details;
      try {
        details = await extractEventDetailsFromImage(currentEvent.imageUrl, mimeType, storedApiKey);
      } catch (err) {
        if (err.message === 'API_KEY_MISSING') {
          const key = prompt("Google Gemini API Key is missing (Production environment). Please enter your Gemini API Key:");
          if (!key) throw new Error("API key was not provided. Scan cancelled.");
          localStorage.setItem('BCC_GEMINI_API_KEY', key);
          storedApiKey = key;
          details = await extractEventDetailsFromImage(currentEvent.imageUrl, mimeType, storedApiKey);
        } else {
          throw err;
        }
      }
      
      setCurrentEvent(prev => ({
        ...prev,
        name: details.name || prev.name,
        date: details.date || prev.date,
        category: details.category || prev.category,
        location: {
          address: details.address || prev.location.address,
          area: details.area || prev.location.area,
        },
        price: {
          type: details.priceType || prev.price.type,
          amount: details.priceAmount !== undefined ? details.priceAmount : prev.price.amount,
        },
        description: details.description || prev.description,
        organizer: {
          name: details.organizerName || prev.organizer.name,
          contact: details.organizerContact || prev.organizer.contact,
        },
        tags: details.tags && details.tags.length > 0 ? details.tags : prev.tags
      }));
      toast.success("Flyer scanned successfully! Please review the extracted details.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to scan flyer: " + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (events.find(evt => evt.id === currentEvent.id)) {
      updateEvent(currentEvent);
    } else {
      addEvent(currentEvent);
    }
    setIsEditing(false);
    setCurrentEvent(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Login | Business Connect Community</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-bcc-dark flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background blobs for login */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bcc-yellow/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bcc-card/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2rem] w-full max-w-md border border-white/10 shadow-2xl relative z-10"
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 12 }}
              className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(245,197,24,0.3)] bg-bcc-card"
            >
              <img src="/logo.jpg" alt="BCC Logo" className="w-full h-full object-cover" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-display font-bold text-white text-center mb-2">Workspace</h1>
          <p className="text-bcc-muted text-center mb-8 font-medium">Authenticate to manage content</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none transition-all"
                placeholder="Enter password..."
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-bcc-yellow text-bcc-dark font-bold py-4 rounded-2xl hover:bg-yellow-400 transition-colors shadow-[0_4px_20px_rgba(245,197,24,0.3)]"
            >
              Login to Dashboard
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm font-medium text-bcc-muted hover:text-white transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Website
            </Link>
          </div>
        </motion.div>
      </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Business Connect Community</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-bcc-dark text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-bcc-card/50 border-r border-white/5 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-bold text-lg">BCC CMS</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Menu</div>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-bcc-yellow/10 text-bcc-yellow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('events'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'events' ? 'bg-bcc-yellow/10 text-bcc-yellow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Calendar className="w-5 h-5" /> Events
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-bcc-yellow/10 text-bcc-yellow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Settings className="w-5 h-5" /> Settings
          </a>
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => setIsAuthenticated(false)} className="flex w-full items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-bcc-card/30 backdrop-blur flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold">Event Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
               Live Site <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bcc-yellow to-orange-500 p-0.5">
              <div className="w-full h-full rounded-full bg-bcc-card border-2 border-transparent overflow-hidden">
                <img src="/logo.jpg" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
          
          {/* Metrics Row */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><CalendarDays className="w-6 h-6" /></div>
                  <h3 className="text-gray-400 font-medium">Total Events</h3>
                </div>
                <p className="text-4xl font-display font-bold">{metrics.total}</p>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-500/10 text-green-400 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                  <h3 className="text-gray-400 font-medium">Upcoming</h3>
                </div>
                <p className="text-4xl font-display font-bold">{metrics.upcoming}</p>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-bcc-yellow/10 text-bcc-yellow rounded-xl"><Star className="w-6 h-6" /></div>
                  <h3 className="text-gray-400 font-medium">Featured</h3>
                </div>
                <p className="text-4xl font-display font-bold">{metrics.featured}</p>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><CreditCard className="w-6 h-6" /></div>
                  <h3 className="text-gray-400 font-medium">Paid Events</h3>
                </div>
                <p className="text-4xl font-display font-bold">{metrics.paid}</p>
              </motion.div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display">Recent Events</h2>
                <button onClick={() => setActiveTab('events')} className="text-bcc-yellow hover:underline text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <img src={event.imageUrl} className="w-16 h-16 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{event.name}</h3>
                      <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-gray-300">{event.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <>
          {/* Table Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-bcc-yellow transition-colors" />
              <input 
                type="text" 
                placeholder="Search events..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-bcc-yellow/30 focus:bg-white/10 transition-all font-medium"
              />
            </div>
            <button 
              onClick={handleAddNew}
              className="bg-bcc-yellow text-bcc-dark font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(245,197,24,0.2)] w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" /> Create Event
            </button>
          </div>

          {/* Events Data Table */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs text-gray-400 uppercase tracking-widest font-semibold">
                    <th className="p-6">Event Details</th>
                    <th className="p-6 hidden sm:table-cell">Date</th>
                    <th className="p-6 hidden md:table-cell">Status</th>
                    <th className="p-6 hidden lg:table-cell">Price</th>
                    <th className="p-6 hidden lg:table-cell">RSVPs</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="hover:bg-white/[0.04] transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden shrink-0 border border-white/5">
                            <img src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-bcc-yellow transition-colors">{event.name}</div>
                            <div className="text-sm text-gray-500 mt-0.5">{event.location.area}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 hidden sm:table-cell text-gray-400 font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-6 hidden md:table-cell">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-gray-300 border border-white/10">
                          {event.category}
                        </span>
                        {event.featured && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-bcc-yellow/10 text-bcc-yellow border border-bcc-yellow/20 ml-2">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="p-6 hidden lg:table-cell">
                        {event.price.type === 'Free' ? (
                          <span className="text-green-400 font-bold">Free</span>
                        ) : (
                          <span className="text-white font-bold">₦{event.price.amount.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-6 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <span className="w-2 h-2 rounded-full bg-bcc-yellow animate-pulse" />
                          {Math.floor(Math.random() * 50) + 12}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleEdit(event)}
                            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-colors border border-white/5"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(event.id)}
                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors border border-red-500/10"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="w-12 h-12 mb-4 opacity-50" />
                          <p className="text-lg font-medium">No events found.</p>
                          <p className="text-sm">Try adjusting your search or add a new event.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/10 rounded-3xl p-10 max-w-3xl border-t-4 border-t-bcc-yellow shadow-2xl">
              <h2 className="text-3xl font-display font-bold mb-4">System Settings</h2>
              <p className="text-gray-400 text-lg mb-8">Configure your workspace preferences and user access limits.</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h3 className="font-bold text-white text-lg">Theme Accent Color</h3>
                    <p className="text-sm text-gray-400 mt-1">Change the primary brand color across the platform.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {['#f5c518', '#3b82f6', '#8b5cf6', '#10b981', '#f43f5e'].map(color => (
                      <button 
                        key={color}
                        onClick={() => {
                          setThemeColor(color);
                          localStorage.setItem('bcc_theme_color', color);
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${themeColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h3 className="font-bold text-white text-lg">AI API Key Management</h3>
                    <p className="text-sm text-gray-400 mt-1">Manage your Gemini API Key for the Event Flyer Autofill feature.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const key = prompt("Enter new Gemini API Key:", localStorage.getItem('BCC_GEMINI_API_KEY') || '');
                      if (key !== null) {
                        localStorage.setItem('BCC_GEMINI_API_KEY', key);
                        toast.success("API Key saved securely to your browser!");
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-bcc-yellow text-bcc-dark font-bold hover:bg-yellow-400 transition-colors"
                  >
                    Update Key
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h3 className="font-bold text-red-400 text-lg">Clear Local Database</h3>
                    <p className="text-sm text-gray-400 mt-1">Wipe all events and reset to default mock data.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure? This will delete all your events!")) {
                        localStorage.removeItem('bcc_events_v2');
                        window.location.reload();
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 border border-red-500/20 transition-colors"
                  >
                    Reset Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* Slide-out Drawer for Edit/Add */}
      <AnimatePresence>
        {isEditing && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[#0f1524] border-l border-white/10 z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    {events.find(e => e.id === currentEvent?.id) ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Fill in the details below to publish.</p>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-gray-400 hover:text-white border border-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>
            
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <form id="event-form" onSubmit={handleSave} className="space-y-8">
                  
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-300">Event Title</label>
                      <input 
                        required type="text" 
                        value={currentEvent.name} 
                        onChange={e => setCurrentEvent({...currentEvent, name: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium"
                        placeholder="e.g. Ibadan Tech Expo 2026"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Date & Time</label>
                        <input 
                          required type="datetime-local" 
                          value={currentEvent.date.slice(0, 16)} 
                          onChange={e => setCurrentEvent({...currentEvent, date: e.target.value + ':00+01:00'})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Category</label>
                        <select 
                          value={currentEvent.category}
                          onChange={e => setCurrentEvent({...currentEvent, category: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium appearance-none"
                        >
                          <option value="Networking">Networking</option>
                          <option value="Business">Business</option>
                          <option value="Creative">Creative</option>
                          <option value="Community">Community</option>
                          <option value="Social">Social</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2 gap-4">
                      <h3 className="text-lg font-bold">Media</h3>
                      <button 
                        type="button"
                        onClick={handleAIScan}
                        disabled={isScanning || !currentEvent?.imageUrl}
                        className="text-sm font-bold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      >
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        {isScanning ? 'Scanning Flyer...' : 'Auto-fill with AI ✨'}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-300">Cover Image</label>
                      <div className="flex flex-col gap-4">
                        {currentEvent.imageUrl && (
                          <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/10 group">
                            <img src={currentEvent.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                              <label className="cursor-pointer bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl text-white font-bold text-sm transition-colors flex items-center gap-2 border border-white/20">
                                <UploadCloud className="w-5 h-5" /> Replace Image
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                              </label>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          {!currentEvent.imageUrl && (
                            <label className="flex-1 w-full flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-2xl hover:border-bcc-yellow/50 hover:bg-bcc-yellow/5 transition-all cursor-pointer bg-black/20 group">
                              <UploadCloud className="w-8 h-8 text-gray-500 mb-3 group-hover:text-bcc-yellow transition-colors" />
                              <span className="text-sm text-gray-300 font-bold">Upload from computer</span>
                              <span className="text-xs text-gray-600 mt-1">JPEG, PNG up to 5MB</span>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                          )}
                          <div className="flex-1 w-full space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Or link from URL</label>
                            <input 
                              type="url" 
                              placeholder="https://example.com/image.jpg"
                              value={currentEvent.imageUrl.startsWith('data:') ? '' : currentEvent.imageUrl} 
                              onChange={e => setCurrentEvent({...currentEvent, imageUrl: e.target.value})}
                              className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium placeholder:text-gray-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-300">Venue Address</label>
                        <input 
                          required type="text" 
                          value={currentEvent.location.address} 
                          onChange={e => setCurrentEvent({...currentEvent, location: {...currentEvent.location, address: e.target.value}})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium"
                          placeholder="e.g. 15 Allen Avenue"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Area</label>
                        <select 
                          value={currentEvent.location.area}
                          onChange={e => setCurrentEvent({...currentEvent, location: {...currentEvent.location, area: e.target.value}})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium appearance-none"
                        >
                          <option value="Ring Road">Ring Road</option>
                          <option value="UI">UI</option>
                          <option value="Bodija">Bodija</option>
                          <option value="Dugbe">Dugbe</option>
                          <option value="Liberty Road">Liberty Road</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2">Pricing & Access</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Ticket Type</label>
                        <select 
                          value={currentEvent.price.type}
                          onChange={e => setCurrentEvent({...currentEvent, price: {...currentEvent.price, type: e.target.value, amount: e.target.value === 'Free' ? 0 : currentEvent.price.amount}})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium appearance-none"
                        >
                          <option value="Free">Free</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                      {currentEvent.price.type === 'Paid' && (
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-300">Amount (₦)</label>
                          <input 
                            required type="number" min="0"
                            value={currentEvent.price.amount} 
                            onChange={e => setCurrentEvent({...currentEvent, price: {...currentEvent.price, amount: Number(e.target.value)}})}
                            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium"
                          />
                        </div>
                      )}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-300">RSVP Link (Optional)</label>
                        <input 
                          type="url" 
                          value={currentEvent.rsvpLink} 
                          onChange={e => setCurrentEvent({...currentEvent, rsvpLink: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium"
                          placeholder="https://tix.africa/..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2">More Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Organizer Name</label>
                        <input 
                          required type="text" 
                          value={currentEvent.organizer.name} 
                          onChange={e => setCurrentEvent({...currentEvent, organizer: {...currentEvent.organizer, name: e.target.value}})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Contact Email/Phone</label>
                        <input 
                          required type="text" 
                          value={currentEvent.organizer.contact} 
                          onChange={e => setCurrentEvent({...currentEvent, organizer: {...currentEvent.organizer, contact: e.target.value}})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-300">Full Description</label>
                        <textarea 
                          required rows="5"
                          value={currentEvent.description} 
                          onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 focus:border-bcc-yellow/50 focus:ring-4 focus:ring-bcc-yellow/10 outline-none text-white font-medium resize-none leading-relaxed"
                          placeholder="Tell us about the event..."
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-4 cursor-pointer group bg-black/20 border border-white/10 p-5 rounded-2xl hover:border-bcc-yellow/30 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={currentEvent.featured} 
                            onChange={e => setCurrentEvent({...currentEvent, featured: e.target.checked})}
                            className="w-6 h-6 accent-bcc-yellow rounded"
                          />
                          <div>
                            <span className="block font-bold text-white mb-0.5">Highlight as Featured Event</span>
                            <span className="block text-sm text-gray-400">Featured events appear prominently on the home page.</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-white/[0.02]">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3.5 rounded-2xl font-bold bg-white/5 hover:bg-white/10 transition-colors text-white border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="event-form"
                  className="px-8 py-3.5 rounded-2xl font-bold bg-bcc-yellow text-bcc-dark hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-[0_4px_20px_rgba(245,197,24,0.3)]"
                >
                  <Save className="w-5 h-5" /> Publish Event
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
