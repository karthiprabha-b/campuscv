"use client";

import React from "react";
import { Globe, ArrowUpRight, Sparkles } from "lucide-react";

const DEFAULT_BIO = "I'm a passionate software developer with a deep interest in building scalable web applications, robust architectures, and intuitive digital experiences.\n\nI love transforming complex problems into clean, elegant code. From engineering responsive frontends to architecting reliable backend services, I focus on delivering high-quality, impactful software solutions.";

interface AboutSectionProps {
  data?: any;
}

export default function AboutSection(props: AboutSectionProps = {}) {
  const data = (props as any)?.data || props || {};
  const about = (typeof data.about === "object" && data.about !== null) ? data.about : {};

  const extractText = (val: any): string => {
    if (val === undefined || val === null) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      if (val.value !== undefined) return String(val.value);
      if (val.text !== undefined) return String(val.text);
      if (val.content !== undefined) return String(val.content);
      if (val.description !== undefined) return String(val.description);
    }
    return String(val);
  };

  const overrides = data?.contentOverrides || {};

  // 1. Resolve Headline Override
  let headlineSummary: string = (
    about.headline ||
    about.title ||
    data.aboutHeadline ||
    data.specialisation ||
    data.specialization ||
    data.focus ||
    (data.headline && data.headline !== data.role ? data.headline : "Specialise in scalable distributed web systems, generative AI applications, and cloud architecture.")
  );

  for (const [k, v] of Object.entries(overrides)) {
    if (k.includes("about") && (k.includes("headline") || k.includes(":h2:") || k.includes(":h3:"))) {
      headlineSummary = extractText(v);
    }
  }

  // 2. Resolve Bio Override with strict priority for the active edited node
  let rawBio: any = null;

  if (overrides["text:about:root:p:0"] !== undefined) {
    rawBio = extractText(overrides["text:about:root:p:0"]);
  } else if (overrides["text:about:bio:0"] !== undefined) {
    rawBio = extractText(overrides["text:about:bio:0"]);
  } else if (overrides["text:about:description:0"] !== undefined) {
    rawBio = extractText(overrides["text:about:description:0"]);
  } else if (overrides["about.description"] !== undefined) {
    rawBio = extractText(overrides["about.description"]);
  } else if (overrides["about.bio"] !== undefined) {
    rawBio = extractText(overrides["about.bio"]);
  } else if (overrides["aboutBio"] !== undefined) {
    rawBio = extractText(overrides["aboutBio"]);
  } else if (overrides["about.text"] !== undefined) {
    rawBio = extractText(overrides["about.text"]);
  } else if (overrides["about"] !== undefined && typeof overrides["about"] === "string") {
    rawBio = extractText(overrides["about"]);
  } else if (overrides["bio"] !== undefined && typeof overrides["bio"] === "string") {
    rawBio = extractText(overrides["bio"]);
  } else if (overrides["description"] !== undefined && typeof overrides["description"] === "string") {
    rawBio = extractText(overrides["description"]);
  } else {
    for (const [k, v] of Object.entries(overrides)) {
      if (
        (k.startsWith("text:about:") || k.includes("about")) &&
        !k.includes("headline") &&
        !k.includes("eyebrow") &&
        !k.includes("location") &&
        !k.includes("github") &&
        !k.includes(":h2:") &&
        !k.includes(":h3:") &&
        !k.includes(":span:")
      ) {
        rawBio = extractText(v);
        break;
      }
    }
  }

  if (rawBio === null) {
    rawBio = (typeof data?.about === "string" ? data.about : null) ||
      about.bio ||
      about.description ||
      about.text ||
      data?.aboutMe ||
      data?.bio ||
      data?.summary ||
      data?.description ||
      data?.personal?.summary ||
      data?.profile?.summary ||
      data?.basics?.summary ||
      DEFAULT_BIO;
  }

  const bioText = Array.isArray(rawBio) ? rawBio.join("\n\n") : String(rawBio ?? "");

  const location = data?.location ||
    data?.personal?.city ||
    data?.basics?.location?.city ||
    data?.about?.location ||
    "San Francisco, CA";

  const githubUrl = data?.socialLinks?.github ||
    data?.socials?.github ||
    data?.github ||
    data?.links?.github ||
    "https://github.com";

  const handle = data?.handle ||
    data?.profile?.handle ||
    (githubUrl ? githubUrl.replace(/^https?:\/\/(www\.)?github\.com\/?/i, "@") : "@portfolio");

  const firstEdu = Array.isArray(data?.education) && data.education.length > 0 ? data.education[0] : null;
  const gpa = firstEdu?.cgpa || firstEdu?.gpa || data?.gpa || data?.cgpa || "";

  return (
    <section 
      id="about" 
      data-cv-section="about" 
      data-node-id="section:about:root:section:0"
      className="py-12 sm:py-16 border-b border-gray-200 scroll-mt-8"
    >
      {/* 1. Core Speciality Heading & Line */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span 
            className="text-xs sm:text-sm font-bold text-brand-700 uppercase tracking-widest"
            data-cv="about.eyebrow"
            data-edit-key="aboutEyebrow"
            data-node-id="text:about:eyebrow:0"
          >
            Specialisation & Focus
          </span>
        </div>
        {headlineSummary && (
          <h2 
            className="text-gray-900 text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed max-w-4xl tracking-tight"
            data-cv="about.headline"
            data-edit-key="aboutHeadline"
            data-node-id="text:about:headline:0"
          >
            {headlineSummary}
          </h2>
        )}
      </div>

      {/* 2. About Me 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
        {/* Left Column: Bio Narrative (Supports Full Multi-Paragraph Text & Real-time Edits) */}
        <div className="lg:col-span-2">
          {bioText ? (
            <p 
              className="text-base sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line"
              data-cv="about.bio"
              data-cv-field="about.bio"
              data-cv-text="about.bio"
              data-cv-fallback="about.description"
              data-edit-key="aboutBio"
              data-node-id="text:about:root:p:0"
            >
              {bioText}
            </p>
          ) : (
            <p 
              className="text-base sm:text-lg text-gray-400 italic leading-relaxed"
              data-cv="about.bio"
              data-cv-field="about.bio"
              data-cv-text="about.bio"
              data-cv-fallback="about.description"
              data-edit-key="aboutBio"
              data-node-id="text:about:root:p:0"
            >
              Click here to add your bio and summary...
            </p>
          )}
        </div>

        {/* Right Column: Meta Info Badges (Location & Portfolio) */}
        <div className="flex flex-col gap-6 p-6 sm:p-7 bg-gray-50/80 rounded-2xl border border-gray-200/90 shadow-2xs">
          {/* Location */}
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Location
            </span>
            <div className="flex items-center gap-2.5 text-base font-bold text-gray-900">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <span data-cv="about.location" data-edit-key="aboutLocation">{location}</span>
            </div>
          </div>

          {/* Portfolio / Social Handle */}
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Portfolio & Links
            </span>
            <a
              href={githubUrl.startsWith("http") ? githubUrl : `https://${githubUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base font-bold text-brand-600 hover:text-brand-700 transition-colors"
              data-cv="about.github"
              data-edit-key="aboutGithub"
            >
              <span>{handle || githubUrl}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Academic Standing (if available) */}
          {gpa && (
            <div className="pt-2 border-t border-gray-200/60">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Academic Standing
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50/80 px-3.5 py-1.5 rounded-lg border border-emerald-200 self-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{gpa.startsWith("GPA") ? gpa : `GPA: ${gpa}`}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
