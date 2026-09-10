import React from 'react';
import {
  Code2,
  Mail,
  User,
  GraduationCap,
  Building2,
  Cpu,
  FolderGit2,
  Briefcase,
  ExternalLink,
  Send,
  Terminal,
  Award
} from 'lucide-react';
import { TemplateProps } from './types';

export default function DefaultPortfolioLayout({
  data,
  isEditMode,
  onFieldChange,
  selectedElementId,
  setSelectedElementId
}: TemplateProps) {
  const textPrimary = data.isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = data.isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
  const bgCard = data.isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-sm';
  const borderLine = data.isDarkMode ? 'border-zinc-800' : 'border-zinc-200/60';

  const renderEditableText = (
    value: string,
    field: string,
    elementId: string,
    className: string = ''
  ) => {
    if (!isEditMode) return <span className={className}>{value}</span>;
    const isSelected = selectedElementId === elementId;
    return (
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onFieldChange?.(field, e.currentTarget.textContent || '')}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElementId?.(elementId);
        }}
        className={`${className} outline-none cursor-text transition-all ${
          isSelected
            ? 'ring-2 ring-violet-500 rounded px-1 py-0.5'
            : 'hover:ring-1 hover:ring-zinc-400 rounded-sm hover:px-0.5'
        }`}
      >
        {value}
      </span>
    );
  };

  const socials = data.socialLinks || {};
  const emailAddr = socials.email || data.ownerEmail || 'contact@campuscv.in';
  const skills = data.skills || [];
  const projects = data.projects || [];
  const timeline = data.timeline || [];

  // Console logs for Hero and About rendering values
  console.log('[DefaultPortfolioLayout] Rendering Hero. values:', {
    'hero.title': data.hero?.title,
    'hero.subtitle': data.hero?.subtitle,
  });
  console.log('[DefaultPortfolioLayout] Rendering About. values:', {
    'about.description': data.about?.description
  });

  return (
    <div id="template-root" className="default-portfolio-layout w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-16">
      {/* Hero Section */}
      <section className="relative py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-900 rounded-full">
              <Code2 className="w-3.5 h-3.5" />
              <span>{data.category || 'Developer Portfolio'}</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${textPrimary}`}>
              Hello, I'm{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {renderEditableText(data.hero?.title ?? '', 'hero.title', 'hero-name')}
              </span>
            </h1>

            <p className={`text-lg sm:text-xl font-normal leading-relaxed ${textSecondary}`}>
              {renderEditableText(data.hero?.subtitle ?? '', 'hero.subtitle', 'hero-tagline')}
            </p>

            {/* Stats */}
            {data.stats && data.stats.length > 0 && (
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t ${borderLine}`}>
                {data.stats.map((stat, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border ${bgCard}`}>
                    <div className="text-xl font-black text-violet-600 dark:text-violet-400">
                      {renderEditableText(stat.value, `stats[${idx}].value`, `stats[${idx}].value`)}
                    </div>
                    <div className={`text-xs font-mono uppercase tracking-wider mt-0.5 ${textSecondary}`}>
                      {renderEditableText(stat.label, `stats[${idx}].label`, `stats[${idx}].label`)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 shadow-xl relative bg-zinc-100 dark:bg-zinc-800">
              <img
                src={data.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`pt-8 border-t ${borderLine} text-left`}>
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
          <User className="w-4 h-4" />
          <span>About Me</span>
        </div>
        <h2 className={`text-2xl font-bold tracking-tight mb-4 ${textPrimary}`}>
          {renderEditableText(data.aboutHeading || 'Background', 'aboutHeading', 'about-heading')}
        </h2>
        <div className={`p-6 sm:p-8 rounded-2xl border ${bgCard}`}>
          <p className={`text-base leading-relaxed ${textSecondary}`}>
            {renderEditableText(
              data.about?.description ?? '',
              'about.description',
              'about-text'
            )}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className={`pt-8 border-t ${borderLine} text-left`}>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            <Cpu className="w-4 h-4" />
            <span>Skills</span>
          </div>
          <h2 className={`text-2xl font-bold tracking-tight mb-4 ${textPrimary}`}>
            {renderEditableText(data.skillsHeading || 'Technologies', 'skillsHeading', 'skills-heading')}
          </h2>
          <div className={`p-6 rounded-2xl border ${bgCard} flex flex-wrap gap-2.5`}>
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900/40"
              >
                {renderEditableText(typeof skill === 'object' ? (skill as any).name : skill, `skills[${idx}]`, `skills[${idx}]`)}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section id="projects" className={`pt-8 border-t ${borderLine} text-left`}>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            <FolderGit2 className="w-4 h-4" />
            <span>Work</span>
          </div>
          <h2 className={`text-2xl font-bold tracking-tight mb-6 ${textPrimary}`}>
            {renderEditableText(data.projectsHeading || 'Featured Projects', 'projectsHeading', 'projects-heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border ${bgCard} space-y-3`}>
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg font-bold ${textPrimary}`}>
                    {renderEditableText(proj.title, `projects[${idx}].title`, `projects[${idx}].title`)}
                  </h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-violet-600">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className={`text-sm ${textSecondary}`}>
                  {renderEditableText(proj.desc, `projects[${idx}].desc`, `projects[${idx}].desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {timeline.length > 0 && (
        <section id="experience" className={`pt-8 border-t ${borderLine} text-left`}>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            <Briefcase className="w-4 h-4" />
            <span>Timeline</span>
          </div>
          <h2 className={`text-2xl font-bold tracking-tight mb-6 ${textPrimary}`}>
            {renderEditableText(data.timelineHeading || 'Experience & Education', 'timelineHeading', 'timeline-heading')}
          </h2>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border ${bgCard} space-y-1`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-base font-bold ${textPrimary}`}>
                    {renderEditableText(item.title, `timeline[${idx}].title`, `timeline[${idx}].title`)}
                  </h3>
                  <span className="text-xs font-mono text-violet-600">{item.subtitle}</span>
                </div>
                <p className={`text-sm ${textSecondary}`}>
                  {renderEditableText(item.desc, `timeline[${idx}].desc`, `timeline[${idx}].desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className={`pt-8 border-t ${borderLine} text-left`}>
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
          <Mail className="w-4 h-4" />
          <span>Contact</span>
        </div>
        <h2 className={`text-2xl font-bold tracking-tight mb-6 ${textPrimary}`}>
          {renderEditableText(data.contactHeading || 'Get In Touch', 'contactHeading', 'contact-heading')}
        </h2>
        <div className={`p-8 rounded-3xl border ${bgCard} text-center space-y-4`}>
          <p className={`text-sm sm:text-base ${textSecondary}`}>
            Reach out via email or direct message for collaborations and inquiries.
          </p>
          <a
            href={`mailto:${emailAddr}`}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-md"
          >
            <Mail className="w-4 h-4" />
            <span>{emailAddr}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
