import React from 'react';
import { ExternalLink, FolderGit2, Calendar, Tag } from 'lucide-react';

export default function Projects({ data = {} }) {
  const userProjects = Array.isArray(data.projects)
    ? data.projects
    : (Array.isArray(data.projects?.items)
      ? data.projects.items
      : (Array.isArray(data.data?.projects)
        ? data.data.projects
        : (Array.isArray(data.content?.projects)
          ? data.content.projects
          : (Array.isArray(data.resume?.projects)
            ? data.resume.projects
            : []))));

  if (!userProjects || userProjects.length === 0) {
    return null;
  }

  const projectsList = userProjects.map((proj, idx) => {
    const tech = Array.isArray(proj.technologies) 
      ? proj.technologies 
      : (Array.isArray(proj.tags) ? proj.tags : (Array.isArray(proj.stack) ? proj.stack : (Array.isArray(proj.skills) ? proj.skills : [])));

    return {
      id: proj.id || `proj-${idx + 1}`,
      image: proj.image || proj.imageUrl || proj.coverImage || proj.thumbnail || '',
      title: proj.title || proj.name || `Project ${idx + 1}`,
      subtitle: proj.subtitle || (tech.slice(0, 2).join(' • ')),
      description: proj.description || proj.desc || proj.summary || '',
      category: proj.category || proj.subCategory || 'Featured Project',
      year: proj.year || proj.date || proj.period || '',
      technologies: tech,
      link: proj.link || proj.url || proj.liveUrl || proj.caseStudyUrl || proj.githubUrl || ''
    };
  });

  const eyebrow = data.projectsEyebrow || data.projects?.eyebrow || 'Selected Work & Research';
  const sectionTitle = data.projectsTitle || data.projects?.title || 'Featured Projects & Case Studies';
  const sectionDesc = data.projectsDescription || data.projects?.description || 'Curated portfolio projects, clinical systems, and software developments.';

  return (
    <section
      id="projects"
      data-cv-section="projects"
      className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200"
              data-cv="projects.eyebrow"
            >
              {eyebrow}
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
              data-cv="projects.title"
            >
              {sectionTitle}
            </h2>
            <p
              className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed"
              data-cv="projects.description"
            >
              {sectionDesc}
            </p>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projectsList.map((project, idx) => (
            <div
              key={project.id || idx}
              data-cv={`projects.${idx}`}
              className="bg-slate-50/80 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:bg-white hover:border-sky-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Project Image Box if available */}
                {project.image ? (
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={project.image}
                      alt={project.title}
                      data-cv={`projects.${idx}.image`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                )}

                {/* Badge & Year */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800"
                    data-cv={`projects.${idx}.category`}
                  >
                    {project.category}
                  </span>
                  {project.year && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"
                      data-cv={`projects.${idx}.year`}
                    >
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{project.year}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors"
                  data-cv={`projects.${idx}.title`}
                >
                  {project.title}
                </h3>

                {/* Description */}
                {project.description && (
                  <p
                    className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3"
                    data-cv={`projects.${idx}.description`}
                  >
                    {project.description}
                  </p>
                )}

                {/* Tech Tags */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        <Tag className="w-2.5 h-2.5 text-sky-500" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Link */}
              {project.link && (
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-sky-800">
                  <span>View Project</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
