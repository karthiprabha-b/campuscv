'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Education from '@/components/Education';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact';
import AosInit from '@/components/AosInit';
import ProjectModal, { Project } from '@/components/ProjectModal';
import ServiceModal, { ServiceHighlight } from '@/components/ServiceModal';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceHighlight | null>(null);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const sections = ['home', 'about', 'education', 'experience', 'projects', 'skills', 'certificates', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={isMobileMenuOpen ? 'nav-active' : ''}>
      {/* AOS Scroll Animation Initializer */}
      <AosInit />

      {/* Mobile Hamburger Button */}
      <a
        className="menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span />
      </a>

      <div className="container-fluid overflow-hidden p-0">
        <div className="row m-0">
          {/* Fixed Left Sidebar (col-lg-2) */}
          <Sidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
          />

          {/* Right Main Content (col-lg-10 offset-lg-2) */}
          <main className="col-lg-10 offset-lg-2 p-0">
            <div className="container py-4 py-xl-5">
              <div className="justify-content-center px-1 mx-1 px-xl-5 mx-xl-5">
                {/* 01: Home / Hero */}
                <Hero
                  onNavigate={handleNavigate}
                  onSelectService={(service) => setSelectedService(service as ServiceHighlight)}
                />

                {/* 02: About / Biography */}
                <About />

                {/* 03: Academic Background / Education */}
                <Education />

                {/* 04: Experience & Career Timeline */}
                <Experience />

                {/* 05: Works / Portfolio */}
                <Projects onSelectProject={(project) => setSelectedProject(project)} />

                {/* 06: Skills Section */}
                <Skills />

                {/* 07: Certificates Section */}
                <Certificates />

                {/* 08: Contact Details */}
                <Contact />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onContact={() => handleNavigate('contact')}
      />
    </div>
  );
}
