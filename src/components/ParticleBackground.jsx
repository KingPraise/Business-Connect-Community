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
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      }
    },
    particles: {
      color: { value: ["#ffffff", "#f5c518", "#ffd700"] },
      move: { 
        direction: "bottom", 
        enable: true, 
        speed: 1.5, 
        straight: false,
        outModes: { default: "out" }
      },
      number: { density: { enable: true, width: 1920, height: 1080 }, value: 120 },
      opacity: { 
        value: { min: 0.1, max: 0.8 },
        animation: { enable: true, speed: 1, sync: false }
      },
      shape: { type: "circle" },
      size: { 
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 2, sync: false }
      },
      wobble: { enable: true, distance: 10, speed: 10 }
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
