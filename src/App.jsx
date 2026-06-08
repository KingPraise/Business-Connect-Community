import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Admin from './pages/Admin';
import About from './pages/About';
import UserDashboard from './pages/UserDashboard';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';

import { useEffect } from 'react';

function App() {
  const location = useLocation();

  useEffect(() => {
    const savedColor = localStorage.getItem('bcc_theme_color');
    if (savedColor) {
      document.documentElement.style.setProperty('--bcc-yellow', savedColor);
    }
  }, []);

  return (
    <>
      <Toaster position="top-center" theme="dark" richColors />
      <CustomCursor />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><UserDashboard /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
