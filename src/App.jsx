import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Admin from './pages/Admin';
import About from './pages/About';
import UserDashboard from './pages/UserDashboard';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';

function App() {
  const location = useLocation();

  return (
    <>
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
