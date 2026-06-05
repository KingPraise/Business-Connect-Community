import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MapPin, Tag, Banknote, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ["All", "Networking", "Business", "Creative", "Community", "Social"];
const AREAS = ["All", "Ring Road", "UI", "Bodija", "Dugbe", "Liberty Road"];
const PRICES = ["All", "Free", "Paid"];

function CustomSelect({ icon: Icon, label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0 w-full sm:w-auto" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border transition-all duration-300 ${isOpen ? 'bg-white/10 border-bcc-yellow/50 shadow-[0_0_20px_rgba(245,197,24,0.15)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${value !== 'All' ? 'text-bcc-yellow' : 'text-bcc-muted'}`} />
          <span className={`text-sm font-semibold tracking-wide ${value !== 'All' ? 'text-white' : 'text-gray-400'}`}>
            {value === 'All' ? label : value}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-bcc-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
            className="absolute top-full mt-3 left-0 w-full min-w-[160px] bg-bcc-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-[100]"
          >
            <div className="max-h-60 overflow-y-auto scrollbar-hide py-2 flex flex-col gap-1 p-2">
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => { onChange(option); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all ${value === option ? 'bg-bcc-yellow/20 text-bcc-yellow font-bold shadow-inner' : 'text-gray-300 hover:bg-white/10 hover:text-white font-medium'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  selectedArea,
  setSelectedArea,
  selectedPrice,
  setSelectedPrice
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className="bg-bcc-card/80 backdrop-blur-3xl rounded-[2rem] p-4 md:p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-5xl mx-auto w-full -mt-16 relative z-50"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-grow w-full group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-bcc-yellow transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-12 py-4 border border-white/10 rounded-2xl leading-5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-bcc-yellow/40 focus:bg-white/10 focus:ring-4 focus:ring-bcc-yellow/10 transition-all duration-300 text-base font-medium shadow-inner"
            placeholder="Search for incredible events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <div className="p-1 bg-white/10 hover:bg-white/20 rounded-full">
                  <X className="w-4 h-4" />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto relative z-[60]">
          <CustomSelect 
            icon={Tag} 
            label="Category" 
            options={CATEGORIES} 
            value={selectedCategory} 
            onChange={setSelectedCategory} 
          />
          <CustomSelect 
            icon={MapPin} 
            label="Area" 
            options={AREAS} 
            value={selectedArea} 
            onChange={setSelectedArea} 
          />
          <CustomSelect 
            icon={Banknote} 
            label="Price" 
            options={PRICES} 
            value={selectedPrice} 
            onChange={setSelectedPrice} 
          />
        </div>
      </div>
    </motion.div>
  );
}
