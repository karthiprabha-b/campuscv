import React from 'react';
import { Mail, Github, Linkedin, ExternalLink, Sparkles, Code2 } from 'lucide-react';
import { TemplateProps } from './types';
import { mockDb, CustomTemplate } from '../utils/mockDb';

export default function CustomDynamicLayout(props: TemplateProps) {
  const { data, isEditMode, onFieldChange, selectedElementId, setSelectedElementId } = props;

  // Retrieve matching custom template config if available
  const customTemplates = mockDb.getCustomTemplates();
  const targetId = data.templateId || data.layoutStyle || '';
  const customTmpl = customTemplates.find(t => t.id === targetId);

  const isDark = data.isDarkMode;
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const bgCard = isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-sm';
  const borderLine = isDark ? 'border-zinc-800' : 'border-zinc-200/60';

  const renderEditableText = (value: string, field: string, elementId: string, className: string = '') => {
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
          isSelected ? 'ring-2 ring-purple-500 rounded px-1 py-0.5' : 'hover:ring-1 hover:ring-zinc-400 rounded-sm hover:px-0.5'
        }`}
      >
        {value}
      </span>
    );
  };

  const socials = data.socialLinks || {};
  const emailAddr = socials.email || data.ownerEmail || 'contact@campuscv.in';

  // Console logs for Hero and About rendering values
  console.log('[CustomDynamicLayout] Rendering Hero. values:', {
    'hero.title': data.hero?.title,
    'hero.subtitle': data.hero?.subtitle,
  });
  console.log('[CustomDynamicLayout] Rendering About. values:', {
    'about.description': data.about?.description
  });

  // Inject custom CSS if uploaded in zip
  return (
    <div className="custom-dynamic-layout w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12 text-left font-sans">
      {customTmpl?.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: customTmpl.customCSS }} />
      )}

      {/* Hero Section */}
      <section className="py-6 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 rounded-full">
          <Code2 className="w-3.5 h-3.5" />
          <span>{customTmpl?.name || data.category || 'Uploaded UI/UX Template'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${textPrimary}`}>
              Hello, I'm{' '}
              <span className="text-purple-600 dark:text-purple-400">
                {renderEditableText(data.hero?.title ?? '', 'hero.title', 'hero-name')}
              </span>
            </h1>
            <p className={`text-lg leading-relaxed ${textSecondary}`}>
              {renderEditableText(data.hero?.subtitle ?? '', 'hero.subtitle', 'hero-tagline')}
            </p>

            {data.stats && data.stats.length > 0 && (
              <div className={`grid grid-cols-3 gap-4 pt-4 border-t ${borderLine}`}>
                {data.stats.map((st, idx) => (
                  <div key={idx}>
                    <div className="text-xl font-bold text-purple-600">
                      {renderEditableText(st.value, `stat-val-${idx}`, `stat-val-${idx}`)}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      {renderEditableText(st.label, `stat-lbl-${idx}`, `stat-lbl-${idx}`)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {data.profileImage && (
            <div className="md:col-span-4 flex justify-center">
              <div className="w-56 h-56 rounded-2xl overflow-hidden border-2 shadow-xl">
                <img src={data.profileImage} alt={data.name || 'Profile'} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className={`pt-8 border-t ${borderLine} space-y-3`}>
        <h2 className={`text-2xl font-bold ${textPrimary}`}>About Me</h2>
        <div className={`p-6 rounded-2xl border ${bgCard}`}>
          <p className={`text-base leading-relaxed ${textSecondary}`}>
            {renderEditableText(data.about?.description ?? '', 'about.description', 'about-text')}
          </p>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className={`pt-8 border-t ${borderLine} space-y-3`}>
        <h2 className={`text-2xl font-bold ${textPrimary}`}>Technical Skills</h2>
        <div className={`p-6 rounded-2xl border ${bgCard} flex flex-wrap gap-2.5`}>
          {(data.skills || []).map((sk, idx) => (
            <span key={idx} className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 border border-purple-200">
              {renderEditableText(typeof sk === 'object' ? (sk as any).name : sk, `skills[${idx}]`, `skills[${idx}]`)}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className={`pt-8 border-t ${borderLine} space-y-4`}>
        <h2 className={`text-2xl font-bold ${textPrimary}`}>Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data.projects || []).map((pj, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border ${bgCard} space-y-3`}>
              <h3 className={`text-lg font-bold ${textPrimary}`}>
                {renderEditableText(pj.title, `projects[${idx}].title`, `projects[${idx}].title`)}
              </h3>
              <p className={`text-sm ${textSecondary}`}>
                {renderEditableText(pj.desc, `projects[${idx}].desc`, `projects[${idx}].desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={`pt-8 border-t ${borderLine}`}>
        <div className={`p-8 rounded-3xl border ${bgCard} text-center space-y-4`}>
          <p className={textSecondary}>Send an email to connect directly.</p>
          <a href={`mailto:${emailAddr}`} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold text-sm rounded-xl shadow-md">
            <Mail className="w-4 h-4" />
            <span>{emailAddr}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
