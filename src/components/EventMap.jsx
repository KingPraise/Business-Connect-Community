import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for BCC
const bccIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function EventMap({ events, onEventClick }) {
  // Center of Ibadan approximately
  const defaultCenter = [7.3775, 3.9059];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[600px] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(245,197,24,0.15)] border border-white/10 relative z-0"
    >
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {events.map((event) => {
          if (!event.location?.coordinates) return null;
          
          return (
            <Marker 
              key={event.id} 
              position={event.location.coordinates}
              icon={bccIcon}
            >
              <Popup className="bcc-popup">
                <div className="p-1 min-w-[200px]">
                  <img 
                    src={event.imageUrl} 
                    alt={event.name} 
                    className="w-full h-24 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-sm mb-1 text-gray-900">{event.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{event.location.area}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => onEventClick(event)}
                    className="w-full bg-bcc-yellow text-bcc-dark font-medium py-1.5 rounded-md text-xs hover:bg-yellow-400 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </motion.div>
  );
}
