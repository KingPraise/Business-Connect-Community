import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  "https://scontent-los4-1.cdninstagram.com/v/t51.82787-15/657692953_17912125614361129_1503465094118326988_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=Mzg2NTE3NDY0MDg5NzMxODUzOA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=z7x3yD5yH4oQ7kNvwFxqzA-&_nc_oc=AdrDs29_Wr9yqYMrCbY3XHtPOXRdWbn8lUHO86Nlab4bruZGjYpA9wIoUkKXE5D0dbU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-los4-1.cdninstagram.com&_nc_gid=wOiijWbHEmDMETHlU_KycA&_nc_ss=7a22e&oh=00_Af_pO1hllmtlhnzEZzJeMt8hli25jpcnok08BFehldcUZQ&oe=6A27217F",
  "https://scontent-los4-1.cdninstagram.com/v/t51.82787-15/670505166_17915543310361129_6529284632874426959_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_cat=108&ig_cache_key=Mzg4MDk1NjczNjczOTc2MjM4Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=OiSrUIoMNqMQ7kNvwFr9mD7&_nc_oc=AdqikgcS593XUTe91bgLcCdRxdR6eyCJ8PhhgYua8lYlRNNQFznFtm5pm8R4y3oH2As&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-los4-1.cdninstagram.com&_nc_gid=ENi7DGHlbtvNGEz-uyMT9w&_nc_ss=7a22e&oh=00_Af_etGzv3c_73xkXpVu6gP8BgQSE9bAC44lb_d5ttpmA3Q&oe=6A271EF3",
  "https://scontent-los4-1.cdninstagram.com/v/t51.82787-15/657385126_17911345665361129_3877946486945034792_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzg2MTY5OTA3MTM5NjM0NTQ4Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=F37aWYni1mAQ7kNvwFVyiFX&_nc_oc=AdoemFEFQet0T1zC3z40TCsVgnSZDvllHGycCyswsHhsWcidZwxlvXWkXll3hutjpVc&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-los4-1.cdninstagram.com&_nc_gid=Ut9bCRZwVXnOYJrLy0Rj0Q&_nc_ss=7a22e&oh=00_Af8BvpQMGnp5wgsIIqV8BwIWPdUKEmiX32bAl8GUKOSqwg&oe=6A275994"
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          alt="BCC Hero Background"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none" />
    </div>
  );
}
