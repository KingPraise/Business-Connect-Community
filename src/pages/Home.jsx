import { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Map, LayoutGrid } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import EventCardSkeleton from '../components/EventCardSkeleton';
import ParticleBackground from '../components/ParticleBackground';
import SponsorMarquee from '../components/SponsorMarquee';
import HeroSlider from '../components/HeroSlider';
import EventMap from '../components/EventMap';

export default function Home() {
  const { events, loading } = useEvents();
  const [isMapView, setIsMapView] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  
  // Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Derived filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search
      const matchesSearch = 
        (event.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.tags || []).some(tag => (tag || '').toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      
      // Area
      const matchesArea = selectedArea === 'All' || event.location.area === selectedArea;
      
      // Price
      const matchesPrice = selectedPrice === 'All' || 
        (selectedPrice === 'Free' && (event.price.type === 'Free' || event.price.amount === 0)) ||
        (selectedPrice === 'Paid' && event.price.type === 'Paid' && event.price.amount > 0);

      return matchesSearch && matchesCategory && matchesArea && matchesPrice;
    }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
  }, [events, searchQuery, selectedCategory, selectedArea, selectedPrice]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Business Connect Community | Ibadan Events & Networking</title>
        <meta name="description" content="Discover the best professional networking, creative, and business events happening in Ibadan. Find opportunities and grow your community." />
      </Helmet>
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden flex flex-col justify-center min-h-[70vh]">
          {/* Background Slider */}
          <HeroSlider />
          
          {/* Snow Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <ParticleBackground />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bcc-dark/50 to-bcc-dark z-10 pointer-events-none" />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="container mx-auto px-4 relative z-20 text-center max-w-4xl"
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight drop-shadow-xl">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-bcc-yellow to-yellow-200">Opportunities</span> in the City
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto drop-shadow-md">
              Find the best networking, business, and creative events happening in Ibadan. Connect with professionals and grow your community.
            </motion.p>
          </motion.div>
        </section>

        <SponsorMarquee />

        {/* About BCC Section */}
        <section className="container mx-auto px-4 pb-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="glass-panel p-8 md:p-12 rounded-3xl border-bcc-yellow/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-bcc-yellow rounded-full mix-blend-multiply filter blur-[80px] opacity-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-10" />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-bcc-yellow to-yellow-400">BCC</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                The <strong className="text-white">Business Connect Community</strong> is Ibadan’s premier ecosystem for ambitious professionals, forward-thinking entrepreneurs, and imaginative creatives. We believe in the power of serendipity and structured networking. Whether you are looking for your next co-founder, seeking investment, or simply wanting to expand your horizons, BCC provides the curated environments and premium events to make those meaningful connections happen.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[
                  { title: "Curated Events", desc: "Access to high-quality, vetted networking sessions." },
                  { title: "Premium Network", desc: "Connect with industry leaders and innovators." },
                  { title: "Growth Focused", desc: "Workshops and seminars designed to scale your impact." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-bcc-yellow/30 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-bcc-yellow mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 pb-24 relative z-10">
          <FilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
          />

          <div className="mt-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <h2 className="text-3xl font-display font-bold text-white">
                Upcoming Events
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-bcc-muted font-medium">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                </span>
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setIsMapView(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!isMapView ? 'bg-bcc-yellow text-bcc-dark shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button
                    onClick={() => setIsMapView(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isMapView ? 'bg-bcc-yellow text-bcc-dark shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Map className="w-4 h-4" />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <EventCardSkeleton key={n} />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              isMapView ? (
                <EventMap events={filteredEvents} onEventClick={setSelectedEvent} />
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onClick={setSelectedEvent} 
                    />
                  ))}
                </motion.div>
              )
            ) : (
              <div className="text-center py-20 bg-bcc-card/50 rounded-3xl border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🏜️</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">No events found</h3>
                <p className="text-bcc-muted max-w-md mx-auto">
                  We couldn't find any events matching your current filters. Try adjusting your search or clearing the filters.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedArea('All');
                    setSelectedPrice('All');
                  }}
                  className="mt-6 text-bcc-yellow hover:text-yellow-400 font-medium hover:underline transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
