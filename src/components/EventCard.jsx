import { MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function CategoryBadge({ category }) {
  const getCategoryStyles = () => {
    switch (category.toLowerCase()) {
      case 'networking': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'business': return 'bg-bcc-yellow/10 text-bcc-yellow border-bcc-yellow/20';
      case 'creative': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'community': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'social': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${getCategoryStyles()}`}>
      {category}
    </span>
  );
}

export function PricePill({ price }) {
  const isFree = price.type.toLowerCase() === 'free' || price.amount === 0;
  
  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
      isFree ? 'bg-white/10 text-white' : 'bg-bcc-yellow text-bcc-dark'
    }`}>
      {isFree ? 'Free' : `₦${price.amount.toLocaleString()}`}
    </div>
  );
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function EventCard({ event, onClick }) {
  const dateObj = new Date(event.date);
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();

  // 3D Hover Effect state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      variants={item}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(event)}
      className="group bg-bcc-card rounded-2xl overflow-hidden border border-white/5 hover:border-bcc-yellow/50 transition-colors duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(245,197,24,0.15)] flex flex-col h-full relative z-10"
    >
      <div className="relative h-48 w-full overflow-hidden" style={{ transform: "translateZ(30px)" }}>
        <img 
          src={event.imageUrl} 
          alt={event.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bcc-card via-transparent to-transparent opacity-90" />
        
        {/* Date Box */}
        <div className="absolute top-4 left-4 glass-panel rounded-lg p-2 text-center border-white/20 min-w-[3rem] shadow-lg">
          <div className="text-bcc-yellow text-[10px] font-bold tracking-wider">{month}</div>
          <div className="text-white font-display text-xl leading-none mt-1">{day}</div>
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          {event.featured && (
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="bg-bcc-yellow text-bcc-dark text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-md"
            >
              Featured
            </motion.span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow bg-bcc-card" style={{ transform: "translateZ(40px)" }}>
        <div className="flex justify-between items-start mb-3 gap-2">
          <CategoryBadge category={event.category} />
          <PricePill price={event.price} />
        </div>
        
        <h3 className="font-display text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-bcc-yellow transition-colors group-hover:glow-text">
          {event.name}
        </h3>
        
        <div className="mt-auto pt-4 space-y-2">
          <div className="flex items-center text-bcc-muted text-sm gap-2">
            <CalendarIcon className="w-4 h-4 text-bcc-yellow/70 shrink-0" />
            <span className="truncate">
              {dateObj.toLocaleDateString('en-NG', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center text-bcc-muted text-sm gap-2">
            <MapPin className="w-4 h-4 text-bcc-yellow/70 shrink-0" />
            <span className="truncate">{event.location.area}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
