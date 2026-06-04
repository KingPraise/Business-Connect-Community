import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bcc-dark mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-bcc-card shrink-0">
                <img src="/logo.jpg" alt="BCC Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg text-white">Business Connect Community</span>
            </div>
            <p className="text-bcc-muted text-sm leading-relaxed max-w-sm">
              The premier platform for discovering and listing professional networking, business, and creative events in Ibadan, Nigeria.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-bcc-muted">
              <li><Link to="/" className="hover:text-bcc-yellow transition-colors">Discover Events</Link></li>
              <li><Link to="/about" className="hover:text-bcc-yellow transition-colors">About Us</Link></li>
              <li><Link to="/admin" className="hover:text-bcc-yellow transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-bcc-muted">
              <li>hello@bccibadan.com</li>
              <li>Ibadan, Oyo State</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-bcc-muted">
          <p>&copy; {new Date().getFullYear()} Business Connect Community. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
