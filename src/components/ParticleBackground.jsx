import { useEffect, useState, useMemo } from "react";
import Particles from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    let isMounted = true;
    loadSlim(tsParticles).then(() => {
      if (isMounted) {
        setInit(true);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const options = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        resize: true,
      }
    },
    particles: {
      color: { value: "#ffffff" },
      move: { 
        direction: "bottom", 
        enable: true, 
        speed: 1, 
        straight: false 
      },
      number: { density: { enable: true }, value: 150 },
      opacity: { value: { min: 0.1, max: 0.8 } },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 4 } },
      wobble: { enable: true, distance: 5, speed: 10 }
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 z-0 pointer-events-auto"
      options={options}
    />
  );
}
