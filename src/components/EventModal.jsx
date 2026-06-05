import { X, MapPin, Calendar, ExternalLink, User, Tag, Ticket } from 'lucide-react';
import { useState } from 'react';
import { CategoryBadge, PricePill } from './EventCard';
import { useAuth } from '../hooks/useAuth';

export default function EventModal({ event, onClose }) {
  const { user } = useAuth();
  const [rsvpStatus, setRsvpStatus] = useState('idle'); // 'idle', 'loading', 'success'
  if (!event) return null;

  const dateObj = new Date(event.date);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-bcc-card rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black p-2 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 w-full shrink-0">
          <img 
            src={event.imageUrl} 
            alt={event.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bcc-card via-bcc-card/40 to-transparent" />
        </div>

        {/* Details Container */}
        <div className="p-6 sm:p-8 -mt-20 relative z-10 flex-grow flex flex-col">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <CategoryBadge category={event.category} />
            <PricePill price={event.price} />
            {event.featured && (
              <span className="bg-bcc-yellow text-bcc-dark text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
            {event.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-bcc-dark/50 rounded-2xl p-6 border border-white/5">
            <div className="flex items-start gap-4">
              <div className="bg-bcc-yellow/10 p-3 rounded-xl text-bcc-yellow shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-bcc-muted text-sm font-medium mb-1">Date & Time</h4>
                <p className="text-white">
                  {dateObj.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-white/70 text-sm mt-0.5">
                  {dateObj.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-bcc-yellow/10 p-3 rounded-xl text-bcc-yellow shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-bcc-muted text-sm font-medium mb-1">Location</h4>
                <p className="text-white">{event.location.address}</p>
                <p className="text-white/70 text-sm mt-0.5">{event.location.area}, Ibadan</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-display font-bold text-white mb-4">About This Event</h3>
            <div className="prose prose-invert prose-p:text-bcc-muted max-w-none">
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/10">
            <div>
              <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                <User className="w-4 h-4 text-bcc-yellow" />
                Organizer
              </h4>
              <p className="text-bcc-muted">{event.organizer.name}</p>
              <a href={`mailto:${event.organizer.contact}`} className="text-bcc-yellow hover:underline text-sm block mt-1">
                {event.organizer.contact}
              </a>
            </div>
            
            <div>
              <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                <Tag className="w-4 h-4 text-bcc-yellow" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <span key={tag} className="bg-white/5 text-white/70 px-2.5 py-1 rounded-md text-xs border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto flex justify-end items-center gap-4">
            {rsvpStatus === 'success' && (
              <span className="text-green-400 font-medium flex items-center gap-2">
                <Ticket className="w-5 h-5" /> RSVP Successful!
              </span>
            )}
            <button 
              onClick={() => {
                if (!user) {
                  alert("Please log in to RSVP for this event.");
                  return;
                }
                setRsvpStatus('loading');
                setTimeout(() => setRsvpStatus('success'), 1000);
              }}
              disabled={rsvpStatus === 'loading' || rsvpStatus === 'success'}
              className="bg-bcc-yellow text-bcc-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-[0_4px_20px_rgba(245,197,24,0.3)] hover:-translate-y-1 inline-flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {rsvpStatus === 'loading' ? 'Processing...' : rsvpStatus === 'success' ? 'Ticket Secured' : (event.price.type === 'Free' ? 'Register Now' : 'Get Tickets')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
