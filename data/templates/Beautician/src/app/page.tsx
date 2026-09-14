"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7F5] text-charcoal-900 flex flex-col selection:bg-blush-200 selection:text-blush-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Education & Certifications Section */}
      <Education />

      {/* Experience Timeline Section */}
      <Experience />

      {/* Projects & Interactive Before/After Transformations Section */}
      <Projects />

      {/* Skills & Product Formulations Section */}
      <Skills />

      {/* Contact & Studio Location Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
