"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, Github, CheckCircle2 } from "lucide-react";

interface ProjectModalProps {
  project: any;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Image */}
        {project.image && (
          <div className="h-56 w-full relative bg-gray-100 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {project.categoryLabel && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-gray-800 border border-gray-200 shadow-xs">
                {project.categoryLabel}
              </div>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-heading">
            {project.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
            {project.fullDesc || project.shortDesc}
          </p>

          {project.highlights && project.highlights.length > 0 && (
            <>
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Key Highlights & Features
              </h3>
              <ul className="space-y-2 mb-6">
                {project.highlights.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <>
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Technologies & Tools
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.techStack.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Interactive Preview</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Github className="w-4 h-4" />
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
