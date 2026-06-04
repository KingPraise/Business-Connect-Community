import { useState, useEffect } from 'react';
import { initialEvents } from '../data/mockEvents';

const STORAGE_KEY = 'bcc_events';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        let parsedEvents = JSON.parse(stored);
        let changed = false;
        
        parsedEvents = parsedEvents.map(evt => {
          if (evt.id === 'evt-003' && evt.imageUrl.includes('1558769132-cb1fac089431')) {
            changed = true;
            return { ...evt, imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800' };
          }
          if (evt.id === 'evt-006' && evt.imageUrl.includes('1556761175-5973dc0f32d7')) {
            changed = true;
            return { ...evt, imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800' };
          }
          return evt;
        });

        setEvents(parsedEvents);

        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedEvents));
        }
      } catch (e) {
        console.error("Failed to parse stored events", e);
        setEvents(initialEvents);
      }
    } else {
      // Initialize with mock data if empty
      setEvents(initialEvents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
    }
    setLoading(false);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events, loading]);

  const addEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prev) => prev.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt));
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter(evt => evt.id !== id));
  };

  return { events, addEvent, updateEvent, deleteEvent, loading };
}
