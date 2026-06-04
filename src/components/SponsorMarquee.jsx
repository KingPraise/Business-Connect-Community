import FastMarquee from 'react-fast-marquee';
import { Building2, Briefcase, Globe, Monitor, Users, Layers, Award, Shield } from 'lucide-react';

// Handle CJS interop for Vite
const Marquee = FastMarquee.default || FastMarquee;

const sponsors = [
  { name: 'Ibadan Tech Hub', icon: Monitor },
  { name: 'Oyo State Innovates', icon: Globe },
  { name: 'BCC Ventures', icon: Briefcase },
  { name: 'Enterprise Hub', icon: Building2 },
  { name: 'Founders Network', icon: Users },
  { name: 'Creative Alliance', icon: Layers },
  { name: 'Global Standard', icon: Award },
  { name: 'Trust Partners', icon: Shield },
];

export default function SponsorMarquee() {
  return (
    <div className="py-12 bg-bcc-dark/50 border-y border-white/5 relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-medium text-bcc-muted uppercase tracking-widest">
          Trusted by top communities and brands
        </p>
      </div>
      <Marquee gradient={true} gradientColor="#0f172a" gradientWidth={150} speed={40} pauseOnHover={true}>
        <div className="flex items-center gap-16 px-8">
          {sponsors.map((sponsor, idx) => {
            const Icon = sponsor.icon;
            return (
              <div key={idx} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <Icon className="w-8 h-8 text-bcc-yellow" />
                <span className="font-display font-bold text-xl text-white">{sponsor.name}</span>
              </div>
            );
          })}
        </div>
      </Marquee>
    </div>
  );
}
