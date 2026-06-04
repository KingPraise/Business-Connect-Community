import Header from '../components/Header';
import Footer from '../components/Footer';
import { Target, Users, Settings, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.4 } }
};

export default function About() {
  const pillars = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Peer-to-Peer Machinery & Strategic Partnerships",
      description: "At its core, BCC Ibadan exists to combat founder isolation and build structured collaborations. Rather than relying on surface-level business card exchanges, it curates environments where business owners can meet complementary operators. This enables joint ventures, B2B resource pooling, and shared market intelligence tailored specifically to the regional economic landscape of Ibadan."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "High-Yield Networking & Local Events",
      description: "The community utilizes its digital presence, particularly on Instagram (@bccibadan), to coordinate physical meetups, business mixers, and masterclasses. These touchpoints bridge the gap between digital strategy and physical market presence, allowing local service providers, tech professionals, and traditional business owners to build high-trust relationships face-to-face."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Localization of Modern Business Systems",
      description: "BCC Ibadan acts as an open-source advisory channel for its members. The community frequently highlights systems-driven frameworks, helping members scale their operations by focusing on Digital Infrastructure, Operational Auditing, and Financial Literacy."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Mentorship & Group Accountability",
      description: "By creating structured mastermind environments, BCC Ibadan connects emerging operators with seasoned local mentors. This feedback loop helps founders stress-test their ideas, optimize their workflows, and adapt quickly to shifting macroeconomic trends in Nigeria."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bcc-dark text-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-bcc-yellow/5 to-transparent z-0" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="container mx-auto px-4 relative z-10 max-w-4xl text-center"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              About <span className="text-bcc-yellow">BCC</span> Ibadan
            </h1>
            <p className="text-xl text-bcc-muted leading-relaxed">
              A targeted local ecosystem built explicitly for entrepreneurs, founders, creators, and business leaders operating within Oyo State.
            </p>
          </motion.div>
        </section>

        {/* Introduction Section */}
        <section className="py-20 container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <p className="text-white/80 leading-relaxed text-lg mb-8">
              While the internet handles global tech networks, BCC Ibadan focuses on the ground reality of running and growing a business in Ibadan. It serves as an active structural hub for high-value professional matchmaking and operational knowledge sharing.
            </p>
            <p className="text-white/80 leading-relaxed text-lg mb-16 border-l-4 border-bcc-yellow pl-6 bg-white/5 p-6 rounded-r-2xl shadow-inner">
              The community serves as a vital micro-ecosystem, transforming how business owners in Ibadan scale their operations, access talent, and build sustainable corporate infrastructure.
            </p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold mb-12 text-center"
          >
            The Structural Blueprint
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {pillars.map((pillar, idx) => (
              <motion.div key={idx} variants={itemVariants} className="bg-bcc-card rounded-3xl p-8 border border-white/5 hover:border-bcc-yellow/30 transition-colors group">
                <div className="bg-bcc-yellow/10 w-16 h-16 rounded-2xl flex items-center justify-center text-bcc-yellow mb-6 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-4">{pillar.title}</h3>
                <p className="text-bcc-muted leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
