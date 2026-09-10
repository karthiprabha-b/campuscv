import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Hero from './sections/Hero';
import Achievements from './sections/Achievements';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';

import { normalizeData } from './utils/normalizeData';
import './styles/index.css';

export default function Template(props = {}) {
  // Support incoming props from CampusCV editor
  const rawPropsData = props?.data || props?.portfolio || props || {};
  const [liveData, setLiveData] = useState(() => normalizeData(rawPropsData));

  // Sync when props change
  useEffect(() => {
    setLiveData(normalizeData(props?.data || props?.portfolio || props || {}));
  }, [props?.data, props?.portfolio, props]);

  // Real-time listener for CampusCV editor iframe postMessage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event) => {
      try {
        const payload = event.data;
        if (!payload || typeof payload !== 'object') return;

        if (
          payload.type === 'CAMPUSCV_SET_DATA' ||
          payload.type === 'SET_PORTFOLIO_DATA' ||
          payload.type === 'UPDATE_DATA' ||
          payload.type === 'CAMPUSCV_UPDATE_DATA' ||
          payload.type === 'campuscv_update'
        ) {
          const incoming = payload.data || payload.portfolio || payload.payload;
          if (incoming && typeof incoming === 'object') {
            setLiveData(normalizeData(incoming));
          }
        } else if (payload.type === 'UPDATE_FIELD' && payload.field) {
          setLiveData((prev) => {
            const copy = { ...prev };
            const parts = payload.field.split('.');
            if (parts.length === 1) {
              copy[parts[0]] = payload.value;
            } else if (parts.length === 2) {
              copy[parts[0]] = { ...copy[parts[0]], [parts[1]]: payload.value };
            }
            return normalizeData(copy);
          });
        }
      } catch (err) {
        console.warn('CampusCV postMessage listener notice:', err);
      }
    };

    window.addEventListener('message', handleMessage);

    // Announce template ready to CampusCV parent frame
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'CAMPUSCV_TEMPLATE_READY', templateId: 'executive-lawyer-portfolio' }, '*');
      }
    } catch (_) {}

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const data = liveData;

  return (
    <div className="campuscv-executive-template min-h-screen bg-[#FAF8F4] text-[#1A1A1A] font-sans antialiased">
      {/* 1. Navbar */}
      <Navbar data={data} />

      {/* 2. Core Portfolio Sections */}
      <main>
        <Hero data={data} />
        <Achievements data={data} />
        <About data={data} />
        <Skills data={data} />
        <Projects data={data} />
        <Services data={data} />
        <Experience data={data} />
        <Education data={data} />
        <Testimonials data={data} />
        <Contact data={data} />
      </main>

      {/* 3. Footer */}
      <Footer data={data} />
    </div>
  );
}

export { Template as Portfolio };
