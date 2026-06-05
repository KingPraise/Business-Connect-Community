import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, LogIn, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';

export default function Header() {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 w-full glass-panel border-b border-white/10"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Logo representation */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,197,24,0.4)] overflow-hidden shrink-0 bg-bcc-card"
            >
              <img src="/logo.jpg" alt="BCC Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl leading-none text-white group-hover:glow-text transition-all duration-300">BCC</span>
              <span className="text-[10px] text-bcc-muted uppercase tracking-widest hidden sm:block">Business Connect Community</span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-bcc-muted hover:text-white transition-colors">Events</Link>
            <Link to="/about" className="text-sm font-medium text-bcc-muted hover:text-white transition-colors">About Us</Link>
            
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium text-bcc-muted hover:text-bcc-yellow transition-colors flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">My Tickets</span>
              </Link>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="text-sm font-medium text-bcc-muted hover:text-bcc-yellow transition-colors flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            <Link to="/admin" className="text-sm font-medium text-bcc-muted hover:text-bcc-yellow transition-colors flex items-center gap-2">
              <span className="hidden sm:inline opacity-30 text-xs">|</span>
              <span className="hidden sm:inline opacity-50 ml-2">Admin</span>
            </Link>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="hidden sm:flex bg-gradient-to-r from-bcc-yellow to-yellow-400 text-bcc-dark px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-[0_4px_20px_rgba(245,197,24,0.3)] items-center gap-2 hover:shadow-[0_4px_25px_rgba(245,197,24,0.5)]">
                <Calendar className="w-4 h-4" />
                Find Events
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

