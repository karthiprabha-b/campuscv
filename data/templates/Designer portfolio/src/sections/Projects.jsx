import React from 'react';
import { ExternalLink } from 'lucide-react';

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

  // Merge each item ensuring individual card image & details remain strictly isolated
  const projectsList = userProjects.map((proj, idx) => {
    const cardOverride = data?.contentOverrides?.[`image:projects:card:${idx}:img:0`]?.src
      || (typeof data?.contentOverrides?.[`image:projects:card:${idx}:img:0`] === 'string' ? data?.contentOverrides?.[`image:projects:card:${idx}:img:0`] : null)
      || data?.contentOverrides?.[`projects.${idx}.image`]?.src
      || (typeof data?.contentOverrides?.[`projects.${idx}.image`] === 'string' ? data?.contentOverrides?.[`projects.${idx}.image`] : null)
      || data?.contentOverrides?.[`projects[${idx}].image`]?.src
      || (typeof data?.contentOverrides?.[`projects[${idx}].image`] === 'string' ? data?.contentOverrides?.[`projects[${idx}].image`] : null);

    const img = cardOverride || proj.image || proj.imageUrl || proj.coverImage || proj.thumbnail || "";
    const tech = Array.isArray(proj.technologies) 
      ? proj.technologies 
      : (Array.isArray(proj.tags) ? proj.tags : (Array.isArray(proj.stack) ? proj.stack : []));

    return {
      id: proj.id || `proj-${idx + 1}`,
      image: img,
      title: proj.title || proj.name || `Project ${idx + 1}`,
      subtitle: proj.subtitle || (tech.slice(0, 2).join(' • ')),
      description: proj.description || proj.desc || proj.summary || "",
      category: proj.category || proj.subCategory || "Featured Project",
      year: proj.year || proj.date || "",
      technologies: tech,
      link: proj.link || proj.url || proj.liveUrl || proj.caseStudyUrl || proj.githubUrl || ""
    };
  });

  const eyebrow = data.projectsEyebrow || data.projects?.eyebrow || "01 / Selected Work";
  const sectionTitle = data.projectsTitle || data.projects?.title || "Featured Case Studies";
  const sectionDesc = data.projectsDescription || data.projects?.description || "A curated selection of digital products built with user empathy, strategic intent, and visual precision.";

  return (
    <section id="projects" data-cv-section="projects" className="py-16 sm:py-24 md:py-32 border-b border-[#E5E0D8]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block mb-2" data-cv="projects.eyebrow">
            {eyebrow}
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight break-words max-w-full" data-cv="projects.title">
            {sectionTitle}
          </h2>
          {sectionDesc && (
            <p className="text-sm sm:text-base text-[#666666] mt-3 sm:mt-4 font-normal leading-relaxed break-words" data-cv="projects.description">
              {sectionDesc}
            </p>
          )}
        </div>

        {/* 3 Separate Project Cards - Each card contains its own separate image & details directly */}
        <div className="space-y-16 sm:space-y-20 md:space-y-32" data-cv-collection="projects.items">
          {projectsList.map((project, idx) => {
            const isEven = idx % 2 === 0;
            const projectTitle = data?.contentOverrides?.[`text:projects:card:${idx}:h3:0`]?.text
              || data?.contentOverrides?.[`projects.${idx}.title`]
              || data?.contentOverrides?.[`projects[${idx}].title`]
              || project.title;

            const projectCategory = data?.contentOverrides?.[`text:projects:card:${idx}:span:0`]?.text
              || data?.contentOverrides?.[`projects.${idx}.category`]
              || data?.contentOverrides?.[`projects[${idx}].category`]
              || project.category;

            const projectSubtitle = data?.contentOverrides?.[`text:projects:card:${idx}:p:0`]?.text
              || data?.contentOverrides?.[`projects.${idx}.subtitle`]
              || data?.contentOverrides?.[`projects[${idx}].subtitle`]
              || project.subtitle;

            const projectDesc = data?.contentOverrides?.[`text:projects:card:${idx}:p:1`]?.text
              || data?.contentOverrides?.[`projects.${idx}.description`]
              || data?.contentOverrides?.[`projects[${idx}].description`]
              || project.description;

            const projectYear = data?.contentOverrides?.[`text:projects:card:${idx}:div:0`]?.text
              || data?.contentOverrides?.[`projects.${idx}.year`]
              || data?.contentOverrides?.[`projects[${idx}].year`]
              || project.year;

            const techList = project.technologies || [];
            const projectLink = project.link || "";

            return (
              <article
                key={project.id || `proj-${idx}`}
                data-cv={`projects.items[${idx}]`}
                data-cv-collection="projects"
                data-cv-item-id={project.id || `proj-${idx + 1}`}
                data-cv-index={idx}
                data-node-id={`container:projects:card:${idx}`}
                className="project-card card group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-center"
              >
                {/* Dedicated Separate Image / Visual Box for this Card */}
                <div
                  className={`min-w-0 w-full md:col-span-7 project-img-${isEven ? 'even' : 'odd'}`}
                  style={{ order: isEven ? 1 : 2 }}
                >
                  <div data-node-id={`container:projects:card:${idx}:imageBox`} className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#F2EEE9] border border-[#E5E0D8] shadow-md group-hover:shadow-xl transition-all duration-500 flex items-center justify-center cursor-pointer">
                    {project.image ? (
                      <img
                        data-node-id={`image:projects:card:${idx}:img:0`}
                        data-cv-collection="projects"
                        data-cv-item-id={project.id || `proj-${idx + 1}`}
                        data-cv-index={idx}
                        data-edit-key={`projects.${idx}.image`}
                        data-cv={`projects.items[${idx}].image`}
                        src={project.image}
                        alt={projectTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
                      />
                    ) : (
                      <div data-node-id={`image:projects:card:${idx}:img:0`} className="w-full h-full bg-gradient-to-br from-[#FAF8F5] to-[#E5E0D8] flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E5E0D8] flex items-center justify-center mb-3 shadow-xs">
                          <span className="text-lg font-extrabold text-[var(--campuscv-accent,var(--cv-accent,#FF4500))]">
                            {(projectTitle || 'P').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#888888]">{projectCategory || "Featured Project"}</p>
                      </div>
                    )}
                    {projectYear && (
                      <div
                        data-node-id={`text:projects:card:${idx}:div:0`}
                        data-edit-key={`projects.${idx}.year`}
                        data-cv={`projects.items[${idx}].year`}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#111111] shadow-xs pointer-events-none"
                      >
                        {projectYear}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dedicated Content Box for this Card */}
                <div
                  className={`min-w-0 w-full space-y-5 md:col-span-5 project-content-${isEven ? 'even' : 'odd'}`}
                  style={{ order: isEven ? 2 : 1 }}
                >
                  {projectCategory && (
                    <span
                      data-node-id={`text:projects:card:${idx}:span:0`}
                      data-edit-key={`projects.${idx}.category`}
                      data-cv={`projects.items[${idx}].category`}
                      className="text-xs uppercase font-extrabold tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block break-normal"
                    >
                      {projectCategory}
                    </span>
                  )}
                  <h3
                    data-node-id={`text:projects:card:${idx}:h3:0`}
                    data-edit-key={`projects.${idx}.title`}
                    data-cv={`projects.items[${idx}].title`}
                    className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] break-normal whitespace-normal hyphens-none leading-tight"
                  >
                    {projectTitle}
                  </h3>
                  {projectSubtitle && (
                    <p
                      data-node-id={`text:projects:card:${idx}:p:0`}
                      data-edit-key={`projects.${idx}.subtitle`}
                      data-cv={`projects.items[${idx}].subtitle`}
                      className="text-sm sm:text-base font-semibold text-[#111111] break-normal"
                    >
                      {projectSubtitle}
                    </p>
                  )}
                  {projectDesc && (
                    <p
                      data-node-id={`text:projects:card:${idx}:p:1`}
                      data-edit-key={`projects.${idx}.description`}
                      data-cv={`projects.items[${idx}].description`}
                      className="text-xs sm:text-sm text-[#555555] leading-relaxed break-normal whitespace-normal"
                    >
                      {projectDesc}
                    </p>
                  )}
                  {Array.isArray(techList) && techList.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2" data-cv={`projects.items[${idx}].technologies`}>
                      {techList.map((tag, tagIdx) => (
                        <div key={tagIdx} data-node-id={`container:projects:card:${idx}:tag:${tagIdx}`}>
                          <span
                            data-node-id={`text:projects:card:${idx}:tag:${tagIdx}`}
                            data-edit-key={`projects.${idx}.technologies.${tagIdx}`}
                            data-cv={`projects.items[${idx}].technologies[${tagIdx}]`}
                            className="px-3 py-1 bg-[#F2EEE9] text-[#111111] rounded-md text-xs font-semibold inline-block break-normal"
                          >
                            {typeof tag === 'string' ? tag : (tag?.name || String(tag))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {projectLink && (
                    <div className="pt-2">
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-node-id={`button:projects:card:${idx}:link:0`}
                        data-edit-key={`projects.${idx}.link`}
                        data-cv={`projects.items[${idx}].link`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors"
                      >
                        <span data-node-id={`text:projects:card:${idx}:linkText:0`}>View Project</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
