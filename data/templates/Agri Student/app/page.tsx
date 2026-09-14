'use client';

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Full-Size Background Image */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Education Section */}
      <Education />

      {/* Experience & Field Trials */}
      <Experience />

      {/* Projects & Innovations */}
      <Projects />

      {/* Skills Matrix */}
      <Skills />

      {/* Certificates & Accreditations */}
      <Certificates />

      {/* Direct Contact Channels */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
